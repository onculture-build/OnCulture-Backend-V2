import { Request } from 'express';

export enum AuthStrategyType {
  JWT = 'jwt',
  PUBLIC = 'public',
}

export interface JwtPayload {
  userId: string;
  branchId: string;
  sessionId: string;
  email: string;
}

export interface RequestWithUser extends Request {
  [x: string]: any;
  user: JwtPayload;
  permittedFields?: any;
  selectFields?: any;
}
