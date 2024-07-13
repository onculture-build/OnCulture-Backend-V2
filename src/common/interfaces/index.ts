import { PaperFormat, PDFMargin } from 'puppeteer';

export abstract class SeedRunner {
  abstract run(): Promise<any>;
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNKNOWN = 'Unknown',
}

export enum ResponseMessage {
  SUCCESS = 'Request Successful!',
  FAILED = 'Request Failed!',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type GeneratePdfOptions = {
  margin?: PDFMargin;
  printBackground?: boolean;
  format?: PaperFormat;
};
