import { OPEN_ROUTE_KEY } from '@@/common/decorators/route.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../interfaces';

@Injectable()
export class SubdomainGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    console.log('🚀 ~ SubdomainGuard ~ canActivate ~ request:', request.user);

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

    return !!subdomain;
  }

  private getSubdomainFromRequest(request: RequestWithUser): string | null {
    const host = request['company'];
    if (host) {
      return host;
    }
    return null;
  }
}
