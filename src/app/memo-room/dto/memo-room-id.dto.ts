import { ApiProperty } from '@nestjs/swagger';
import { MemoRoom } from '../memo-room.entity';

export class MemoRoomId {
  @ApiProperty({ example: 1 })
  id: number;

  static of(memoRoom: MemoRoom) {
    const memoRoomId = new MemoRoomId();
    memoRoomId.id = memoRoom.id;
    return memoRoomId;
  }
}
