import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheKeysEnums } from 'src/common/cache/cache.enum';
import { CacheService } from 'src/common/cache/cache.service';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private coreCacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.access_token,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(request: Request, jwt: JwtPayload): Promise<JwtPayload> {
    let [, token] = String(request.headers['authorization']).split(/\s+/);
    if (!token) {
      token = String(request['query']?.token);
    }
    const [, , sessionKey] = String(token).split('.');
    if (!sessionKey) {
      return undefined;
    } else {
      return await this.coreCacheService.wrap(
        `${CacheKeysEnums.TOKENS}:${jwt.userId}:${sessionKey}`,
        (payload, error) => {
          if (error) {
            console.error(error);
          }

          return payload;
        },
        { ttl: this.configService.get('jwt.expiry') },
      );
    }
  }
}
