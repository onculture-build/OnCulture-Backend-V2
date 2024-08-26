import { CacheService } from '@@/common/cache/cache.service';
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import {
  ConflictException,
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
import { BaseUser, PrismaClient } from '@prisma/client';
import { EmployeeStatus } from '@@/common/enums';
import { AppUtilities } from '@@/common/utils/app.utilities';
import * as moment from 'moment';
import { JwtPayload, RequestWithUser } from './interfaces';
import { CacheKeysEnums } from '@@/common/cache/cache.enum';
import { CookieOptions, Request, Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { v4 } from 'uuid';
import { AllowedUserDto } from './dto/allowed-user.dto';
import { EmailBuilder } from '@@/common/messaging/builder/email-builder';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/signup.dto';
import { BaseCompanyRequestService } from '@@/base/base-company/base-company-request/base-company-request.service';
import { BaseCompanyQueueProducer } from '@@/base/queue/producer';
import { SetPasswordDto } from './dto/set-password.dto';

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
    private companyQueueProducer: BaseCompanyQueueProducer,
    // private readonly fileService: FileService,
  ) {
    this.jwtExpires = this.configService.get<number>('jwt.expiry');
  }

  private readonly logger = new Logger(AuthService.name);

  async getAllowedUsers() {
    return this.prismaClient.allowedUser.findMany({});
  }

  async checkAllowedUser({ email }: AllowedUserDto) {
    const allowedUser = await this.prismaClient.allowedUser.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!allowedUser) throw new UnauthorizedException('User not allowed!');

    return !!allowedUser;
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
    const allowedUser = await this.prismaClient.allowedUser.findFirst({
      where: {
        email: dto.userInfo.email.toLowerCase(),
      },
    });

    const companyRequest: any =
      await this.companyRequestService.setupCompanyRequest(dto);

    if (!companyRequest) {
      throw new ServiceUnavailableException('Unable to onboard company');
    }

    this.messagingService
      .sendCompanyOnboardingRequestEmail({
        ...dto,
        ipAddress,
      })
      .catch(console.error);

    // handle case for allowed user
    if (allowedUser) {
      this.companyQueueProducer.processOnboardCompany({
        companyId: companyRequest.id,
      });
    }

    return companyRequest;
  }

  async loginUser(
    dto: LoginDto,
    lastLoginIp: string,
    req: Request,
    response: Response,
  ) {
    const { email, employeeNo, password } = dto;

    let baseUser: BaseUser;
    let foundEmployee;

    if (email) {
      baseUser = await this.prismaClient.baseUser.findFirst({
        where: { email, status: true },
      });

      if (!baseUser)
        throw new UnauthorizedException(
          'Cannot login. Check credentials or contact your administrator.',
        );
    }

    const companyPrisma =
      await this.prismaClientManager.getCompanyPrismaClientFromRequest(req);

    if (employeeNo) {
      foundEmployee = await companyPrisma.employee.findFirst({
        where: {
          employeeNo: { equals: employeeNo, mode: 'insensitive' },
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
        throw new UnauthorizedException(
          'Cannot login. Check credentials or contact your administrator.',
        );

      baseUser = await this.prismaClient.baseUser.findFirst({
        where: {
          email: foundEmployee.user.emails[0].email,
        },
      });
    }

    const companyUser = await companyPrisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: email || foundEmployee.user.emails[0].email,
            isPrimary: true,
          },
        },
      },
      include: {
        employee: true,
        role: true,
      },
    });

    const { employee, role, ...user } = companyUser;

    // validate password
    const isMatch = AppUtilities.validatePassword(
      password,
      companyUser.password,
    );

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        branchId: employee.branchId,
        employeeId: user?.employeeId,
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
      branchId: foundEmployee?.branchId,
      email: email?.toLowerCase() || foundEmployee.user.emails[0].email,
      sessionId,
    };
    //save user jwt token in redis
    await this.cacheService.set(
      `${CacheKeysEnums.TOKENS}:${baseUser.id}:${sessionId}`,
      payload,
      this.jwtExpires,
    );

    await companyPrisma.user.update({
      where: { id: companyUser.id },
      data: {
        lastLogin: moment().toISOString(),
        updatedBy: companyUser.id,
        lastLoginIp,
      },
    });

    // set response cookie
    this.setCookies(accessToken, response);

    const usr = AppUtilities.removeSensitiveData(user, 'password', true);

    return {
      accessToken,
      user: usr,
      employee,
      role: { ...role, menus: [] },
    };
  }

  // fix this implementation
  async setPassword(dto: SetPasswordDto, token: string, req: Request) {
    const cPrisma =
      await this.prismaClientManager.getCompanyPrismaClientFromRequest(req);

    const { email } = JSON.parse(AppUtilities.decode(token));

    const companyUser = await cPrisma.user.findFirst({
      where: {
        emails: {
          some: {
            email,
            isPrimary: true,
          },
        },
      },
    });

    if (!companyUser) throw new NotFoundException('User not found');

    const hash = await AppUtilities.hashAuthSecret(dto.password);

    await cPrisma.user.update({
      where: { id: companyUser.id },
      data: {
        password: hash,
        updatedBy: companyUser.id,
      },
    });
  }

  async changePassword(dto: ChangePasswordDto, req: RequestWithUser) {
    const cPrisma =
      await this.prismaClientManager.getCompanyPrismaClientFromRequest(req);

    const companyUser = await cPrisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: req.user.email,
            isPrimary: true,
          },
        },
      },
    });

    if (!companyUser) throw new NotFoundException('User not found');

    const isMatch = AppUtilities.validatePassword(
      dto.currentPassword,
      companyUser.password,
    );

    if (!isMatch)
      throw new NotAcceptableException('Current password is invalid');

    const hash = await AppUtilities.hashAuthSecret(dto.newPassword);

    await cPrisma.user.update({
      where: { id: companyUser.id },
      data: {
        password: hash,
        updatedBy: companyUser.id,
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
        where: { code: 'resetPassword' },
      });

    if (!messageTemplate) {
      throw new ServiceUnavailableException(
        'Reset password email template not set up!',
      );
    }

    const resetUrl = new URL(
      `${process.env.APP_CLIENT_FORGOT_PASSWORD_URL}?token=${requestId}`,
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

  async resetPassword({ password, token }: ResetPasswordDto, req: Request) {
    const storedEmail = await this.cacheService.get(
      CacheKeysEnums.REQUESTS + token,
    );

    if (!storedEmail) {
      throw new NotAcceptableException('Invalid Request!');
    }

    const modifyingUser = await this.prismaClient.baseUser.findFirst({
      where: { email: storedEmail.email },
    });

    if (!modifyingUser) {
      throw new NotAcceptableException('Invalid password reset request!');
    }

    const hash = await AppUtilities.hashAuthSecret(password);

    const cPrisma =
      await this.prismaClientManager.getCompanyPrismaClientFromRequest(req);

    const companyUser = await cPrisma.user.findFirst({
      where: {
        emails: {
          some: {
            email: storedEmail.email,
            isPrimary: true,
          },
        },
      },
    });

    await cPrisma.user.update({
      where: { id: companyUser.id },
      data: {
        password: hash,
        updatedBy: companyUser.id,
      },
    });
  }

  private setCookies(token: string, response: Response) {
    const maxAge = parseInt(this.configService.get('jwt.expiry'));
    const expires = new Date(new Date().getTime() + maxAge);
    const cookieOptions: CookieOptions = { maxAge, expires, httpOnly: true };
    if (['remote', 'prod'].includes(this.configService.get('app.stage'))) {
      cookieOptions.sameSite = 'none';
      cookieOptions.secure = true;
    }
    response.cookie('access_token', token, cookieOptions);
  }
}
