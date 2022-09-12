import { ApiProperty } from '@nestjs/swagger';
import { MemoRoom } from '../memo-room.entity';
import { RoomTypeDto } from './room-type.dto';

export class MemoRoomDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '장보기목록' })
  name: string;

  @ApiProperty({ type: () => RoomTypeDto })
  roomType: RoomTypeDto;

  static of(memoRoom: MemoRoom) {
    const memoRoomDto = new MemoRoomDto();

    memoRoomDto.id = memoRoom.id;
    memoRoomDto.name = memoRoom.name;
    memoRoomDto.roomType = {
      ...memoRoom.roomType,
      category: memoRoom.roomType.category.name,
    };

    return memoRoomDto;
  }
}
