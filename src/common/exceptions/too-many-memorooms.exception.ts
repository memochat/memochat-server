import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class TooManyMemoRoomsException extends BadRequestException {
  constructor(message = '더 이상 룸을 만들 수 없습니다') {
    super(new ErrorInfo(ResponseStatus.TOO_MANY_MEMOROOMS, message));
  }
}
