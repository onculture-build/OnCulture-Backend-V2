import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BaseUser } from '@prisma/client';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): BaseUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
