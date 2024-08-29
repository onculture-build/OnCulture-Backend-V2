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
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  [x: string]: any;
  user: JwtPayload;
  permittedFields?: any;
  selectFields?: any;
}

export enum PermissionAction {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum PermissionFields {}
