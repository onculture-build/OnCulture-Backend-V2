import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  private Logger: Logger = new Logger('RolesGuard');
  constructor(
    private config: ConfigService,
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    return true;
    // if (!roles) {
    //   return true;
    // }

    // const request = context.switchToHttp().getRequest();
    // const token = this.extractJwtFromRequest(request);
    // if (!token) {
    //   return false;
    // }

    // try {
    //   const decodedToken = this.jwtService.verify(token, {
    //     secret: this.config.get<string>('jwt.secret'),
    //   });

    //   if (!decodedToken?.tenancyId) {
    //     return false;
    //   }

    //   const findCompany = await this.companyModel.findOne({
    //     tenancyId: decodedToken?.tenancyId,
    //   });

    //   const findEmployee = await this.employeeModel.findOne({
    //     company: findCompany._id,
    //     user: new mongoose.Types.ObjectId(decodedToken.sub),
    //   });

    //   if (!findCompany) {
    //     return false;
    //   }

    //   if (!roles.includes(findEmployee.role.toLowerCase() as string)) {
    //     context.switchToHttp().getResponse().status(401).json({
    //       message: 'Priviledges Only!',
    //       statusCode: 401,
    //       success: false,
    //     });
    //   }

    //   context.switchToHttp().getRequest().user = {
    //     ...request.user,
    //     companySlackToken: findCompany.slackAccessToken,
    //     company: findCompany,
    //   };

    //   return true;
    // } catch (error) {
    //   this.Logger.error(error);

    //   return false;
    // }
  }

  // private extractJwtFromRequest(request: any): string | null {
  //   const authHeader = request.headers.authorization;

  //   if (authHeader && authHeader.startsWith('Bearer ')) {
  //     return authHeader.slice(7);
  //   }

  //   return null;
  // }
}
