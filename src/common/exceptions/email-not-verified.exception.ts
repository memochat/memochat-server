import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class EmailNotVerifiedException extends BadRequestException {
  constructor(message = '인증되지 않은 이메일입니다.') {
    super(new ErrorInfo(ResponseStatus.EMAIL_NOT_VERIFIED, message));
  }
}
