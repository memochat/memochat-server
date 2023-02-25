import { ApiProperty } from '@nestjs/swagger';
import { MemoRoom } from '../memo-room.entity';
import { RoomCategoryDto } from './room-type.dto';

export class MemoRoomDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: '2023-02-25T07:14:32.460Z2023-02-25T07:14:32.460Z2' })
  createdAt: Date;

  @ApiProperty({ example: '2023-02-25T07:14:32.460Z2023-02-25T07:14:32.460Z2' })
  updatedAt: Date;

  @ApiProperty({ example: '장보기목록' })
  name: string;

  @ApiProperty({ type: () => RoomCategoryDto })
  roomCategory: RoomCategoryDto;

  @ApiProperty({ example: 'text or link or 사진' })
  message: string;

  @ApiProperty({ example: '2' })
  previousRoomId: number;

  @ApiProperty({ example: '4' })
  nextRoomId: number;

  static of(memoRoom: MemoRoom) {
    const memoRoomDto = new MemoRoomDto();

    memoRoomDto.id = memoRoom.id;
    memoRoomDto.name = memoRoom.name;
    memoRoomDto.roomCategory = {
      ...memoRoom.roomCategory,
      name: memoRoom.roomCategory.name.enumName,
    };
    memoRoomDto.message = memoRoom.message;
    memoRoomDto.createdAt = memoRoom.createdAt;
    memoRoomDto.updatedAt = memoRoom.updatedAt;
    memoRoomDto.previousRoomId = memoRoom.previousRoomId;
    memoRoomDto.nextRoomId = memoRoom.nextRoomId;

    return memoRoomDto;
  }
}
