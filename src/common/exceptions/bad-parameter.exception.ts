import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class BadParameterException extends BadRequestException {
  constructor(message: string) {
    super(new ErrorInfo(ResponseStatus.BAD_PARAMETERS, message));
  }
}
