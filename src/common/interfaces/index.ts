import { PaperFormat, PDFMargin } from 'puppeteer';

export abstract class SeedRunner {
  abstract run(): Promise<any>;
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNKNOWN = 'Unknown',
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  SEPARATED = 'Separated',
  WIDOWED = 'Widowed',
}

export enum ResponseMessage {
  SUCCESS = 'Request Successful!',
  FAILED = 'Request Failed!',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum MessageType {
  Email = 'Email',
  Sms = 'Sms',
}

export type GeneratePdfOptions = {
  margin?: PDFMargin;
  printBackground?: boolean;
  format?: PaperFormat;
};

export interface IUserForgotCompanies {
  email: string;
  firstName: string;
  companies: Record<string, string>[];
}

export type FileUploadType = 'private' | 'public';
