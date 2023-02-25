import { NotFoundException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class MemoRoomNotMatchedException extends NotFoundException {
  constructor(message = '해당 유저의 메모룸이 아닙니다.') {
    super(new ErrorInfo(ResponseStatus.MEMO_ROOM_NOT_MATCHED, message));
  }
}
