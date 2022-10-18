import { NotFoundException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class RoomCategoryNotFoundException extends NotFoundException {
  constructor(message = '해당하는 룸 유형이 존재하지 않습니다') {
    super(new ErrorInfo(ResponseStatus.ROOM_CATEGORY_NOT_FOUND, message));
  }
}
