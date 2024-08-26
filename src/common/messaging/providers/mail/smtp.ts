import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { MailProvider, SendMailOptions, MailProviders } from '../../interfaces';

@Injectable()
export class SmtpMailProvider implements MailProvider {
  private transporter: nodemailer.Transporter;

  constructor(config: SMTPConnection.Options) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendMail(data: SendMailOptions): Promise<nodemailer.SentMessageInfo> {
    if (!this.transporter) {
      throw new Error('Method not implemented.');
    }
    const raw = await this.transporter.sendMail({
      from: data.from,
      messageId: data.ref,
      html: data.body,
      to: data.to,
      subject: data.subject,
      attachments: data.attachments,
    });

    return {
      id: raw.messageId,
      timestamp: new Date().toDateString(),
      raw,
    };
  }

  get id() {
    return MailProviders.Smtp;
  }
}
