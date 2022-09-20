import { NotFoundException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class MemoRoomNotFoundException extends NotFoundException {
  constructor(message = '해당하는 메모룸이 존재하지 않습니다') {
    super(new ErrorInfo(ResponseStatus.MEMO_ROOM_NOT_FOUND, message));
  }
}
