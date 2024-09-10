import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheKeysEnums } from 'src/common/cache/cache.enum';
import { CacheService } from 'src/common/cache/cache.service';
import { JwtPayload } from '../interfaces';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private coreCacheService: CacheService,
    private prisma: PrismaClient,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.access_token,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      passReqToCallback: true,
      ignoreExpiration: true,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(request: Request, jwt: JwtPayload): Promise<JwtPayload> {
    const TOKEN_IS_EXPIRED = jwt.exp && Date.now() >= jwt.exp * 1000;
    if (TOKEN_IS_EXPIRED) {
      throw new UnauthorizedException('Unauthenticated!');
    }

    let [, token] = String(request.headers['authorization']).split(/\s+/);
    if (!token) {
      token = String(request['query']?.token);
    }
    const [, , sessionKey] = String(token).split('.');
    if (!sessionKey) {
      return undefined;
    }
    const sessionPayload = await this.coreCacheService.wrap(
      `${CacheKeysEnums.TOKENS}:${jwt.userId}:${sessionKey}`,
      async () => {
        const user = await this.prisma.baseUser.findFirst({
          where: { email: jwt.email },
        });

        if (!user) throw new BadRequestException();

        return jwt;
      },
      { ttl: this.configService.get('jwt.expiry') },
    );

    return sessionPayload;
  }
}
