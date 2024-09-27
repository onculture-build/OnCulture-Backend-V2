import { CacheService } from '@@/common/cache/cache.service';
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import {
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
import { CreateAllowedUserDto } from './dto/create-allowed-users.dto';
import { EmailBuilder } from '@@/common/messaging/builder/email-builder';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/signup.dto';
import { BaseCompanyRequestService } from '@@/base/base-company/base-company-request/base-company-request.service';
import { BaseCompanyQueueProducer } from '@@/base/queue/producer';
import { SetPasswordDto } from './dto/set-password.dto';
import { FindAllowedUserDto } from './dto/find-allowed-user.dto';

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

  async checkAllowedUser({ email, firstName, lastName }: FindAllowedUserDto) {
    const allowedUser = await this.prismaClient.allowedUser.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!allowedUser) {
      await this.prismaClient.waitlist.upsert({
        where: { email: email.toLowerCase() },
        create: {
          email: email.toLowerCase(),
          firstName,
          lastName,
        },
        update: {},
      });

      throw new UnauthorizedException('User not allowed!');
    }

    return !!allowedUser;
  }

  async addAllowedUsers(
    { emails }: CreateAllowedUserDto,
    req: RequestWithUser,
  ) {
    return this.prismaClient.allowedUser.createMany({
      data: emails.map((email) => ({
        email: email.toLowerCase(),
        createdBy: req.user.userId,
      })),
      skipDuplicates: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // this.messagingService
    //   .sendCompanyOnboardingRequestEmail({
    //     ...dto,
    //     ipAddress,
    //   })
    //   .catch(console.error);

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
          'Unable to login. Check credentials or contact your administrator.',
        );
    }

    const companyPrisma =
      await this.prismaClientManager.getCompanyPrismaClientFromRequest(req);

    if (employeeNo?.length) {
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
          'Unable to login. Check credentials or contact your administrator.',
        );

      baseUser = await this.prismaClient.baseUser.findFirst({
        where: {
          email: foundEmployee.user.emails[0].email,
        },
      });
    }

    const companyUserId = await companyPrisma.userEmail.findUnique({
      where: {
        email: email || foundEmployee.user.emails[0].email,
      },
    });

    if (!companyUserId) {
      throw new UnauthorizedException(
        'Unable to login. Check credentials or contact your administrator.',
      );
    }

    const companyUser = await companyPrisma.user.findFirst({
      where: {
        id: companyUserId.userId,
      },
      include: {
        employee: true,
        role: true,
      },
    });

    if (!companyUser.password) {
      throw new NotAcceptableException(
        'Unable to login. Kindly reset your password',
      );
    }

    const { employee, role, ...user } = companyUser;

    // validate password
    const isMatch = await AppUtilities.validatePassword(
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

  async setPassword(token: string, dto: SetPasswordDto, req: Request) {
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

    if (companyUser.password) {
      throw new NotAcceptableException('Token is expired. Try reset password');
    }

    const hash = await AppUtilities.hashAuthSecret(dto.password);

    await cPrisma.user.update({
      where: { id: companyUser.id },
      data: {
        password: hash,
        updatedBy: companyUser.id,
        emails: {
          update: {
            where: {
              email,
            },
            data: {
              isVerified: true,
            },
          },
        },
        employee: {
          update: {
            status: EmployeeStatus.ACTIVE,
          },
        },
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

  async requestPasswordReset({ email }: RequestPasswordResetDto, req: Request) {
    const companyCode = req['company'] as string;

    const baseUser = await this.prismaClient.baseUserCompany.findFirst({
      where: {
        user: { email: email.toLowerCase() },
        company: { code: companyCode },
      },
      include: {
        user: true,
      },
    });

    if (!baseUser) throw new UnauthorizedException('Invalid email address');

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

    const resetPasswordURL = new URL(
      `https://${companyCode}.${process.env.APP_CLIENT_URL}/reset-password?token=${requestId}`,
    );

    const emailBuilder = new EmailBuilder()
      .useTemplate(messageTemplate, {
        resetPasswordURL,
        email,
        firstName: baseUser.user.firstName,
      })
      .addRecipients(email);

    this.messagingService.sendPasswordRequestEmail(emailBuilder);
  }

  async resetPassword({ password, token }: ResetPasswordDto, req: Request) {
    const storedEmail = await this.cacheService.get(
      CacheKeysEnums.REQUESTS + token,
    );

    if (!storedEmail) {
      throw new NotAcceptableException('Invalid Request! Token expired');
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
