import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';

export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || info || !user) {
      throw new InvalidTokenException();
    }

    return user;
  }
}
