import { Request } from 'express';

export enum AuthStrategyType {
  JWT = 'jwt',
  PUBLIC = 'public',
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
