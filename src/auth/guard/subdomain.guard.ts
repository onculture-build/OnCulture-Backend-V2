import { OPEN_ROUTE_KEY } from '@@/common/decorators/route.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class SubdomainGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const isOpenRoute = this.reflector.getAllAndOverride<boolean>(
      OPEN_ROUTE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isOpenRoute) {
      return true;
    }

    const subdomain = this.getSubdomainFromRequest(request);
    if (!subdomain) {
      throw new NotAcceptableException(
        'Subdomain is required for this endpoint',
      );
    }

    return true;
  }

  private getSubdomainFromRequest(request: Request): string | null {
    const host = request.hostname;
    const parts = host.split('.');
    if (parts.length > 2) {
      return parts[0];
    }
    return null;
  }
}
