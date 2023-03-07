import { NotFoundException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class MemoChatNotFoundException extends NotFoundException {
  constructor(message = '해당하는 메모챗이 존재하지 않습니다') {
    super(new ErrorInfo(ResponseStatus.MEMO_CHAT_NOT_FOUND, message));
  }
}
