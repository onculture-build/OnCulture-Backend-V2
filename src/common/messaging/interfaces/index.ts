import { SentMessageInfo } from 'nodemailer';

export const QUEUE = 'onCulture:messaging:';

export enum JOBS {
  QUEUE_EMAIL = 'queueEmail',
  SEND_EMAIL = 'sendEmail',
}

export interface IEmailMessageBinding {
  recipients: string[];
  body?: string;
  cc?: string[];
  bcc?: string[];
  templateBindings?: Record<string, any>;
}

export interface ISetUpTenantMessagingAccount {
  email: string;
  name: string;
}

export interface FileAttachmentOptions {
  filename: string;
  content: string;
  type?: string;
  disposition?: string;
}

export interface SendMailOptions {
  from?: string;
  ref?: string;
  subject?: string;
  to: string | string[];
  bcc?: string | string[];
  cc?: string | string[];
  body: string;
  attachments?: FileAttachmentOptions[];
}

export interface MailProvider {
  sendMail(mail: SendMailOptions): Promise<SentMessageInfo>;
  id?: string;
}

export enum MailProviders {
  SendGrid = 'SendGrid',
  Smtp = 'Smtp',
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  authUser: string;
  authPassword: string;
}

export interface SendGridConfig {
  apiKey: string;
}

export interface SMSGetBalanceResult {
  balance: number;
}

export interface QueueMailJobAttribs {
  messageId: string;
  payerId: string;
}
