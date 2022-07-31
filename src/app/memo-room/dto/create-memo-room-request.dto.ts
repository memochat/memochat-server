import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Length } from 'class-validator';
import { MemoRoom } from '../memo-room.entity';
import { MemoRoomCatrgory } from '../type/memo-room-category';

export class CreateMemoRoomRequest {
  @IsString()
  @Length(2, 20)
  @ApiProperty({ example: '장보기목록' })
  name: string;

  @IsIn(MemoRoomCatrgory.values().map((v) => v.name))
  @ApiProperty({ example: 'DEFAULT' })
  category: string;

  toEntity() {
    const memoRoom = new MemoRoom();
    memoRoom.name = this.name;
    memoRoom.category = MemoRoomCatrgory.valueOf(this.category);
    return memoRoom;
  }
}
