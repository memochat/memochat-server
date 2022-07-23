import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class NotMatchedPasswordException extends BadRequestException {
  constructor(message = '비밀번호가 일치하지 않습니다') {
    super(new ErrorInfo(ResponseStatus.NOT_MATCHED_PASSWORD, message));
  }
}
