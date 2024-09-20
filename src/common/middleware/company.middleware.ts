import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CompanyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const subdomain = req.headers['x-subdomain'] as string;

    if (subdomain) {
      req['company'] = subdomain;
    }

    next();
  }
}
