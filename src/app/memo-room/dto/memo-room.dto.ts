import { ApiProperty } from '@nestjs/swagger';
import { MemoRoom } from '../memo-room.entity';
import { RoomCategoryDto } from './room-type.dto';

export class MemoRoomDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '장보기목록' })
  name: string;

  @ApiProperty({ type: () => RoomCategoryDto })
  roomCategory: RoomCategoryDto;

  static of(memoRoom: MemoRoom) {
    const memoRoomDto = new MemoRoomDto();

    memoRoomDto.id = memoRoom.id;
    memoRoomDto.name = memoRoom.name;
    memoRoomDto.roomCategory = {
      ...memoRoom.roomCategory,
      name: memoRoom.roomCategory.name.name,
    };

    return memoRoomDto;
  }
}
