import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SignupUserDTO } from './dto/signup-user.dto';

export const Signup = createParamDecorator(
  (data, ctx: ExecutionContext): SignupUserDTO => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
