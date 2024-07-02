import { Request } from 'express';

export abstract class SeedRunner {
  abstract run(): Promise<any>;
}

export enum AuthStrategyType {
  JWT = 'jwt',
  PUBLIC = 'public',
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

export interface JwtPayload {
  userId: string;
  sessionId: string;
  email: string;
  companyId?: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
  permittedFields?: any;
  selectFields?: any;
}
