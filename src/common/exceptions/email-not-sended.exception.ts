import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class EmailNotSendedException extends BadRequestException {
  constructor(message = '메일이 정상적으로 발송되지 않았습니다.') {
    super(new ErrorInfo(ResponseStatus.EMAIL_NOT_SENDED, message));
  }
}
