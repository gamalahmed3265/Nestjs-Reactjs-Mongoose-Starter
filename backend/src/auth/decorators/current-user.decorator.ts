import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfileDto } from '../dto/auth-response.dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserProfileDto => {
    const request = ctx.switchToHttp().getRequest<{ user: UserProfileDto }>();
    return request.user;
  },
);

