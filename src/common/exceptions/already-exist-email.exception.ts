import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class AlreadyExistEmailException extends BadRequestException {
  constructor(message = '이미 존재하는 이메일 입니다') {
    super(new ErrorInfo(ResponseStatus.ALREADY_EXIST_EMAIL, message));
  }
}
