import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class BadParameterException extends BadRequestException {
  constructor(message = '유효하지 않은 요청 값입니다') {
    super(new ErrorInfo(ResponseStatus.BAD_PARAMETERS, message));
  }
}
