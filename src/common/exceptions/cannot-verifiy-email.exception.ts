import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class CannotVerifyEmailException extends BadRequestException {
  constructor(message = '이메일 인증에 실패하였습니다.') {
    super(new ErrorInfo(ResponseStatus.CANNOT_VERIFY_EMAIL, message));
  }
}
