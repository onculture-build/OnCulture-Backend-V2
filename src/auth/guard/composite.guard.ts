import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SubdomainGuard } from './subdomain.guard';
import { AppAuthGuard } from './app.guard';

@Injectable()
export class CompositeGuard implements CanActivate {
  constructor(
    private readonly appAuthGuard: AppAuthGuard,
    private readonly subdomainGuard: SubdomainGuard,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const subdomain = this.subdomainGuard.canActivate(context);
    if (subdomain) return subdomain;

    const isAuthenticated = this.appAuthGuard.canActivate(context);
    if (!isAuthenticated) return false;
  }
}
