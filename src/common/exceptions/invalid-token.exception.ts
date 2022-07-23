import { UnauthorizedException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class InvalidTokenException extends UnauthorizedException {
  constructor(message = '유효하지 않은 토큰 정보 입니다') {
    super(new ErrorInfo(ResponseStatus.INVALID_TOKEN, message));
  }
}
