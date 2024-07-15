import { CacheService } from '@@/common/cache/cache.service';
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { BaseUser, BaseUserCompany, PrismaClient } from '@prisma/client';
import { EmployeeStatus } from '@@/common/enums';
import { AppUtilities } from '@@/common/utils/app.utilities';
import moment from 'moment';
import { JwtPayload, RequestWithUser } from './interfaces';
import { CacheKeysEnums } from '@@/common/cache/cache.enum';
import { CookieOptions, Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { v4 } from 'uuid';
import { AllowedUserDto } from './dto/allowed-user.dto';
import { EmailBuilder } from '@@/common/messaging/builder/email-builder';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/signup.dto';
import { BaseCompanyRequestService } from '@@/base/base-company/base-company-request/base-company-request.service';

@Injectable()
export class AuthService {
  private jwtExpires: number;

  constructor(
    private configService: ConfigService,
    private companyRequestService: BaseCompanyRequestService,
    private jwtService: JwtService,
    private cacheService: CacheService,
    private prismaClientManager: PrismaClientManager,
    private prismaClient: PrismaClient,
    private messagingService: MessagingService,
    // private readonly fileService: FileService,
  ) {
    this.jwtExpires = this.configService.get<number>(
      'jwt.signOptions.expiresIn',
    );
  }

  private readonly logger = new Logger(AuthService.name);

  async getAllowedUsers() {
    return this.prismaClient.allowedUser.findMany({});
  }

  async addAllowedUser({ email }: AllowedUserDto, req: RequestWithUser) {
    const isExisting = await this.prismaClient.allowedUser.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (isExisting) throw new ConflictException('User already allowed');

    return this.prismaClient.allowedUser.create({
      data: {
        email: email.toLowerCase(),
        createdBy: req.user.userId,
      },
    });
  }

  async onboardCompany(dto: SignUpDto, ipAddress: string) {
    const allowedCompany = await this.prismaClient.allowedUser.findFirst({
      where: {
        email: dto.userInfo.email.toLowerCase(),
      },
    });

    const companyRequest =
      await this.companyRequestService.setupBaseCompanyRequest({
        ...dto,
        companyInfo: { ...dto.companyInfo },
      });

    if (!companyRequest) {
      throw new ServiceUnavailableException('Unable to setup company');
    }

    if (!allowedCompany) {
      this.messagingService
        .sendCompanyOnboardingRequestEmail({
          ...dto,
          ipAddress,
        })
        .catch(console.error);

      return companyRequest;
    }

    // handle case for allowed user
  }

  async loginUser(dto: LoginDto, lastLoginIp: string, response: Response) {
    const { email, employeeNo, password, companyCode } = dto;

    let baseUser: BaseUser;
    let userCompany: BaseUserCompany;
    let foundEmployee;

    if (email) {
      baseUser = await this.prismaClient.baseUser.findFirst({
        where: { email },
        include: {
          companies: true,
        },
      });

      if (!baseUser) throw new UnauthorizedException('Invalid credentials');
    }

    if (companyCode) {
      const company = await this.prismaClient.baseUserCompany.findFirst({
        where: {
          company: { code: companyCode, status: true },
          user: { email, status: true },
        },
      });

      if (!company)
        throw new ForbiddenException(
          'Account is deactivated or invalid. Contact support',
        );

      userCompany = await this.prismaClient.baseUserCompany.findFirst({
        where: {
          userId: baseUser.id,
          companyId: company.id,
          status: true,
        },
        include: {
          company: true,
        },
      });

      if (!userCompany)
        throw new NotAcceptableException(
          'Cannot login to this company. Check credentials or contact your administrator.',
        );

      if (employeeNo) {
        const companyClient = this.prismaClientManager.getCompanyPrismaClient(
          userCompany.companyId,
        );

        foundEmployee = await companyClient.coreEmployee.findFirst({
          where: {
            employeeNo,
            status: EmployeeStatus.ACTIVE,
          },
          include: {
            user: {
              include: {
                emails: {
                  where: {
                    isPrimary: true,
                  },
                },
              },
            },
          },
        });

        if (!foundEmployee)
          throw new UnauthorizedException('Invalid credentials');

        baseUser = await this.prismaClient.baseUser.findFirst({
          where: {
            email: foundEmployee.user.emails[0].email,
          },
        });
      }
    }
    // validate password
    const isMatch = AppUtilities.validatePassword(password, baseUser.password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const companyClient = this.prismaClientManager.getCompanyPrismaClient(
      userCompany.companyId,
    );

    const companyUser = await companyClient.companyUser.findFirst({
      where: { emails: { some: { email, isPrimary: true } } },
      include: {
        role: true,
      },
    });

    const accessToken = this.jwtService.sign(
      {
        userId: companyUser.id,
        tenantId: userCompany.companyId,
        employeeId: foundEmployee?.id,
        createdAt: moment().format(),
      },
      {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.jwtExpires,
      },
    );
    const [, , sessionId] = accessToken.split('.');

    const payload: JwtPayload = {
      userId: baseUser.id.toString(),
      email: email.toLowerCase(),
      companyId: userCompany.companyId,
      sessionId,
    };
    //save user jwt token in redis
    await this.cacheService.set(
      `${CacheKeysEnums.TOKENS}:${baseUser.id}:${sessionId}`,
      payload,
      this.jwtExpires,
    );

    await companyClient.companyUser.update({
      where: { id: companyUser.id },
      data: {
        lastLogin: moment().toISOString(),
        updatedBy: companyUser.id,
        lastLoginIp,
      },
    });

    // set response cookie
    this.setCookies(accessToken, response);

    return {
      accessToken,
      user: companyUser,
      company: userCompany,
      role: { ...companyUser.role, menus: [] },
    };
  }

  async changePassword(dto: ChangePasswordDto, req: RequestWithUser) {
    const user = await this.prismaClient.baseUser.findFirst({
      where: { email: req.user.email },
    });

    if (!user) throw new NotFoundException('User not found');

    const isMatch = AppUtilities.validatePassword(
      dto.currentPassword,
      user.password,
    );

    if (!isMatch)
      throw new NotAcceptableException('Current password is invalid');

    const hash = await AppUtilities.hashAuthSecret(dto.newPassword);

    await this.prismaClient.baseUser.update({
      where: { id: user.id },
      data: {
        password: hash,
        updatedBy: user.id,
      },
    });
  }

  async requestPasswordReset({ email }: RequestPasswordResetDto) {
    const baseUser = await this.prismaClient.baseUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!baseUser) throw new UnauthorizedException('Invalid email');

    const requestId = v4();
    await this.cacheService.set(
      CacheKeysEnums.REQUESTS + requestId,
      { email, userId: baseUser.id },
      parseInt(process.env.PASSWORD_RESET_EXPIRES),
    );

    // Get template
    const messageTemplate =
      await this.prismaClient.baseMessageTemplate.findFirst({
        where: { name: 'resetPassword' },
      });

    if (!messageTemplate) {
      throw new ServiceUnavailableException(
        'Reset password email template not set up!',
      );
    }

    const resetUrl = new URL(
      `${process.env.APP_CLIENT_FORGOT_PASSWORD_URL}/${requestId}`,
    );

    const emailBuilder = new EmailBuilder()
      .useTemplate(messageTemplate, {
        invite: { url: resetUrl },
        email,
        firstName: baseUser.firstName,
      })
      .addRecipients(email);

    this.messagingService.sendPasswordRequestEmail(emailBuilder);
  }

  async resetPassword({ password, token }: ResetPasswordDto) {
    const storedEmail = await this.cacheService.get(
      CacheKeysEnums.REQUESTS + token,
    );

    if (!storedEmail) {
      throw new NotAcceptableException('Invalid Request!');
    }

    const modifyingUser = await this.prismaClient.baseUser.findFirst({
      where: { email: storedEmail },
    });
    if (!modifyingUser) {
      throw new NotAcceptableException('Invalid password reset request!');
    }

    const hash = await AppUtilities.hashAuthSecret(password);

    await this.prismaClient.baseUser.update({
      where: { id: modifyingUser.id },
      data: {
        password: hash,
        updatedBy: modifyingUser.id,
      },
    });
  }

  private setCookies(token: string, response: Response) {
    const maxAge = parseInt(process.env.JWT_EXPIRES);
    const expires = new Date(new Date().getTime() + maxAge);
    const cookieOptions: CookieOptions = { maxAge, expires, httpOnly: true };
    if (['remote', 'prod'].includes(this.configService.get('app.stage'))) {
      cookieOptions.sameSite = 'none';
      cookieOptions.secure = true;
    }
    response.cookie('access_token', token, cookieOptions);
  }
}
