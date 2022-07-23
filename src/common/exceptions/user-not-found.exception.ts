import { NotFoundException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class UserNotFoundException extends NotFoundException {
  constructor(message = '해당하는 유저가 존재하지 않습니다') {
    super(new ErrorInfo(ResponseStatus.USER_NOT_FOUND, message));
  }
}
