import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageStatus, MessageType } from '@prisma/client';
import moment from 'moment';
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
  ) {
    // get message template from db
    const prismaClient = this.prismaClientManager.getPrismaClient();
    const emailTemplate = await prismaClient.baseMessageTemplate.findFirst({
      where: { code: 'welcome' },
    });
    const config = await this.getAppEmailConfig();

    const company = await prismaClient.baseCompany.findFirst({
      where: { id: companyId },
    });

    const loginUrl = new URL(
      `https://${company.code}.${process.env.APP_CLIENT_URL}/login`,
    );

    const emailBuilder = new EmailBuilder()
      .useTemplate(emailTemplate, {
        ...userInfo,
        ...companyInfo,
        login: { url: loginUrl },
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
    companyId: string,
    { firstName, lastName, email }: UserInfoDto,
    password: string,
  ) {
    const baseClient = this.prismaClientManager.getPrismaClient();
    const { name: merchantName } =
      await baseClient.baseCompany.findFirstOrThrow({
        where: { id: companyId },
      });
    // get message template from tenant db
    const prismaClient =
      this.prismaClientManager.getCompanyPrismaClient(companyId);
    const emailTemplate = await prismaClient.coreMessageTemplate.findFirst({
      where: { code: 'user-setup' },
    });
    if (!emailTemplate) {
      throw new NotFoundException('The template does not exist');
    }
    const config = await this.getAppEmailConfig();
    const loginUrl = new URL(`${process.env.APP_CLIENT_URL}/login`);

    const emailBuilder = new EmailBuilder()
      .useTemplate(emailTemplate, {
        firstName,
        lastName,
        merchantName,
        email,
        password,
        login: { url: loginUrl },
      })
      .addRecipients([email]);

    // add sender details from config settings
    emailBuilder.addFrom(config.senderAddress, config.senderName);

    // create message in core message table
    const message = await prismaClient.coreMessage.create({
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
      await prismaClient.coreMessage.update({
        where: { id: message.id },
        data: {
          status: MessageStatus.Sent,
          updatedAt: moment().toDate(),
        },
      });
    }
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
    // const legalFileAttachments = await this.createLegalFiles({
    //   userInfo,
    //   companyInfo,
    //   ipAddress,
    //   ...rest,
    // });

    const emailBuilder = new EmailBuilder()
      .useTemplate(emailTemplate, { ...userInfo, ...companyInfo })
      // .addFiles(legalFileAttachments)
      .addRecipients([userInfo.email]);

    // add sender details from config settings
    emailBuilder.addFrom(config.senderAddress, config.senderName);

    // send mail
    await this.mailService
      .setMailProviderOptions(config.provider, config)
      .sendEmail(emailBuilder);
  }

  // private async createLegalFiles(data: SignUpDto & { ipAddress: string }) {
  //   const legalDocuments: [] = this.configService.get('app.legalDocs');
  //   const clientUrl = this.configService.get('app.clientUrl');
  //   const pdfOptions = {
  //     margin: { top: '50px', right: '75px', bottom: '40px', left: '75px' },
  //     printBackground: true,
  //     format: 'A4' as PaperFormat,
  //     displayHeaderFooter: true,
  //     headerTemplate: '<div/>',
  //     footerTemplate: `
  //       <div style="width: 100%; font-size: 9px; color: #bbb; display: flex; align-items: center; justify-content: center">
  //           <div><span class="pageNumber"></span>/<span class="totalPages"></span></div>
  //       </div>
  //     `,
  //   };

  //   const templateData = {
  //     companyName: data.companyInfo.name,
  //     providerContactPerson: `${data.userInfo.firstName} ${data.userInfo.lastName}`,
  //     companyEmail: data.companyInfo.email,
  //     date: moment().format('DD/MM/YYYY'),
  //     ipAddress: data.ipAddress,
  //     issuerName: this.configService.get('legal.issuerName'),
  //     issuerContactPerson: this.configService.get('legal.issuerContactPerson'),
  //     issuerEmail: this.configService.get('legal.issuerEmail'),
  //     issuerContactPersonTitle: this.configService.get(
  //       'legal.issuerContactPersonTitle',
  //     ),
  //   };

  //   const pdfs = await Promise.all(
  //     legalDocuments.map(async ({ filename, uri }) => {
  //       const url = new URL(`${clientUrl}/${uri}`);
  //       Object.entries(templateData).reduce((acc, [key, val]) => {
  //         acc.append(key, val);
  //         return acc;
  //       }, url.searchParams);

  //       const content = (await AppUtilities.generatePdfFromUrl(
  //         url.toString(),
  //         pdfOptions,
  //       )) as Buffer;

  //       return {
  //         filename,
  //         content,
  //         type: 'application/pdf',
  //         disposition: 'attachment',
  //       };
  //     }),
  //   );

  //   return pdfs;
  // }

  //   private paginateGatewayQueryResponse(data: any) {
  //     let results = [],
  //       pageCursors = { previous: null, next: null };
  //     // transform results
  //     if (Array.isArray(data?.items)) {
  //       const hasPrevious = data.meta?.currentPage - 1 >= 1;
  //       const hasNext = data.meta?.currentPage < data.meta?.totalPages;
  //       pageCursors = {
  //         previous:
  //           (hasPrevious && {
  //             cursor: AppUtilities.encode(String(data.meta?.currentPage - 1)),
  //             page: null,
  //             isCurrent: false,
  //           }) ||
  //           null,
  //         next:
  //           (hasNext && {
  //             cursor: AppUtilities.encode(String(data.meta?.currentPage + 1)),
  //             page: null,
  //             isCurrent: false,
  //           }) ||
  //           null,
  //       };
  //       results = data.items.map((data: any) => ({
  //         cursor: null,
  //         node: data,
  //       }));
  //     }

  //     return {
  //       pageEdges: results,
  //       pageCursors,
  //       totalCount: data?.meta?.totalItems || 0,
  //     };
  //   }

  private async getCompanyMailConfig(companyId: string) {
    if (this.companyEmailConfigMemCache.has(companyId)) {
      return this.companyEmailConfigMemCache.get(companyId);
    }
    const prisma = this.prismaClientManager.getCompanyPrismaClient(companyId);

    const setting = await prisma.coreMessageSetting.findFirst();
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
