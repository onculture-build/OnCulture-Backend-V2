import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageStatus, MessageType } from '@prisma/client';
import * as moment from 'moment';
// import { PaperFormat } from 'puppeteer';
import { PrismaClientManager } from '../database/prisma-client-manager';
import { EVENTS } from '../events';
import { EmailBuilder } from './builder/email-builder';
import { MailProviders } from './interfaces';
import { MailService } from './messaging-mail.service';
// import { AppUtilities } from '../utils/app.utilities';
import { SignUpDto } from '@@/auth/dto/signup.dto';
import { UserInfoDto } from '@@/auth/dto/user-info.dto';

@Injectable()
export class MessagingService {
  private senderEmail: string;
  private companyEmailConfigMemCache = new Map<string, any>();

  constructor(
    private configService: ConfigService,
    private prismaClientManager: PrismaClientManager,
    private mailService: MailService,
  ) {
    this.senderEmail = this.configService.get<string>('messaging.senderEmail');
  }

  @OnEvent(EVENTS.EMAIL_CONFIG_UPDATED)
  public handleEmailConfigUpdated() {
    this.companyEmailConfigMemCache = new Map();
  }

  public async sendCompanyEmail(emailBuilder: EmailBuilder, tenantId: string) {
    const config = await this.getCompanyMailConfig(tenantId);
    if (!config) {
      throw new NotAcceptableException('Company mail configuration not setup!');
    }
    // add sender details from config settings
    emailBuilder.addFrom(config.senderAddress, config.senderName);

    return this.mailService
      .setMailProviderOptions(config.provider, config)
      .sendEmail(emailBuilder);
  }

  public async sendPasswordRequestEmail(emailBuilder: EmailBuilder) {
    const config = await this.getAppEmailConfig();
    // add sender details from config settings
    emailBuilder.addFrom(config.senderAddress, config.senderName);

    return this.mailService
      .setMailProviderOptions(config.provider, config)
      .sendEmail(emailBuilder);
  }

  public async sendCompanyOnboardingEmail(
    companyId: string,
    { userInfo, companyInfo }: SignUpDto,
    token: string,
  ) {
    // get message template from db
    const prismaClient = this.prismaClientManager.getPrismaClient();
    const emailTemplate = await prismaClient.baseMessageTemplate.findFirst({
      where: { code: 'welcome' },
    });
    const config = await this.getAppEmailConfig();

    const passwordURL = new URL(
      `https://${companyInfo.code}.${process.env.APP_CLIENT_URL}/set-password?token=${token}`,
    );

    const emailBuilder = new EmailBuilder()
      .useTemplate(emailTemplate, {
        ...userInfo,
        ...companyInfo,
        passwordURL,
      })
      .addRecipients([userInfo.email]);

    // add sender details from config settings
    emailBuilder.addFrom(config.senderAddress, config.senderName);

    // create message in base message table
    const message = await prismaClient.baseMessage.create({
      data: {
        bindings: {
          sender: this.senderEmail,
          recipient: userInfo.email,
        },
        template: { connect: { id: emailTemplate.id } },
        type: MessageType.Email,
        company: { connect: { id: companyId } },
      },
    });

    // send mail
    const { ok } = await this.mailService
      .setMailProviderOptions(config.provider, config)
      .sendEmail(emailBuilder);
    if (ok) {
      await prismaClient.baseMessage.update({
        where: { id: message.id },
        data: {
          status: MessageStatus.Sent,
          updatedAt: moment().toDate(),
        },
      });
    }
  }

  public async sendUserSetupEmail(
    code: string,
    { firstName, lastName, email }: UserInfoDto,
    password?: string,
  ) {
    const baseClient = this.prismaClientManager.getPrismaClient();
    const { name: companyName, id: companyId } =
      await baseClient.baseCompany.findFirstOrThrow({
        where: { code },
      });
    // get message template from tenant db
    const prismaClient =
      this.prismaClientManager.getCompanyPrismaClient(companyId);
    const emailTemplate = await prismaClient.messageTemplate.findFirst({
      where: { code: 'employee-setup' },
    });
    if (!emailTemplate) {
      throw new NotFoundException('The template does not exist');
    }
    const config = await this.getAppEmailConfig();
    const setPasswordURL = new URL(`${process.env.APP_CLIENT_URL}/login`);

    const emailBuilder = new EmailBuilder()
      .useTemplate(emailTemplate, {
        firstName,
        lastName,
        companyName,
        email,
        password,
        setPasswordURL,
      })
      .addRecipients([email]);

    // add sender details from config settings
    emailBuilder.addFrom(config.senderAddress, config.senderName);

    // create message in core message table
    const message = await prismaClient.message.create({
      data: {
        bindings: {
          sender: this.senderEmail,
          recipient: email,
        },
        template: { connect: { id: emailTemplate.id } },
        type: MessageType.Email,
      },
    });

    // send mail
    const { ok } = await this.mailService
      .setMailProviderOptions(config.provider, config)
      .sendEmail(emailBuilder);
    if (ok) {
      await prismaClient.message.update({
        where: { id: message.id },
        data: {
          status: MessageStatus.Sent,
          updatedAt: moment().toDate(),
        },
      });
    }
  }

  public async sendCompanyOnboardingRequestEmail({
    userInfo,
    companyInfo,
    // ipAddress,
    // ...rest
  }: SignUpDto & { ipAddress: string }) {
    // get message template from db
    const prismaClient = this.prismaClientManager.getPrismaClient();
    const emailTemplate = await prismaClient.baseMessageTemplate.findFirst({
      where: { code: 'welcome-request' },
    });

    const config = await this.getAppEmailConfig();

    const emailBuilder = new EmailBuilder()
      .useTemplate(emailTemplate, { ...userInfo, ...companyInfo })
      .addRecipients([userInfo.email]);

    // add sender details from config settings
    emailBuilder.addFrom(config.senderAddress, config.senderName);

    // send mail
    await this.mailService
      .setMailProviderOptions(config.provider, config)
      .sendEmail(emailBuilder);
  }

  private async getAppEmailConfig() {
    return {
      apiKey: this.configService.get<string>('smtp.transport.auth.pass'),
      port: this.configService.get<string>('smtp.transport.port'),
      senderAddress: this.configService.get<string>(
        'smtp.defaults.from.address',
      ),
      senderName: this.configService.get<string>('smtp.defaults.from.name'),
      authPassword: this.configService.get<string>('smtp.transport.auth.pass'),
      authUser: this.configService.get<string>('smtp.transport.auth.user'),
      host: this.configService.get<string>('smtp.transport.host'),
      provider: MailProviders.Smtp,
      secure: this.configService.get<string>('smtp.transport.secure'),
    };
  }

  private async getCompanyMailConfig(companyId: string) {
    if (this.companyEmailConfigMemCache.has(companyId)) {
      return this.companyEmailConfigMemCache.get(companyId);
    }
    const prisma = this.prismaClientManager.getCompanyPrismaClient(companyId);

    const setting = await prisma.messageSetting.findFirst();
    if (!setting.preferredMailProvider) {
      return undefined;
    }
    const config = {
      apiKey: setting.sendGridApiKey,
      port: setting.smtpPort,
      senderAddress: setting.emailSenderAddress,
      senderName: setting.emailSenderName,
      authPassword: setting.smtpAuthPassword,
      authUser: setting.smtpAuthUser,
      host: setting.smtpHost,
      provider: setting.preferredMailProvider,
      secure: setting.smtpSecure,
    };
    this.companyEmailConfigMemCache.set(companyId, config);

    return config;
  }
}
