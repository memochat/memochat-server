import { ApiProperty } from '@nestjs/swagger';
import { MemoRoom } from '../memo-room.entity';

export class MemoRoomDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: '2023-02-25T07:14:32.460Z2023-02-25T07:14:32.460Z2' })
  createdAt: Date;

  @ApiProperty({ example: '2023-02-25T07:14:32.460Z2023-02-25T07:14:32.460Z2' })
  updatedAt: Date;

  @ApiProperty({ example: '장보기목록' })
  name: string;

  @ApiProperty({ example: 'roomCategory 이름 : BUDGET' })
  roomCategoryName: string;

  @ApiProperty({
    example:
      'roomCategory 썸네일 : https://memochat-public.s3.ap-northeast-2.amazonaws.com/memoRoomCategory/memoRoomCategory1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3ADKWL776KJR4DM2%2F20230319%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20230319T072549Z&X-Amz-Expires=86400&X-Amz-Signature=d7caf6bfc27024242f693ea9130e94703e7e1f0a532ce858e21d5f2a808ad9f1&X-Amz-SignedHeaders=host',
  })
  roomCategoryThumbnail: string;

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
    memoRoomDto.roomCategoryName = memoRoom.roomCategory.name.name;
    memoRoomDto.roomCategoryThumbnail = memoRoom.roomCategory.thumbnail;
    memoRoomDto.message = memoRoom.message;
    memoRoomDto.createdAt = memoRoom.createdAt;
    memoRoomDto.updatedAt = memoRoom.updatedAt;
    memoRoomDto.previousRoomId = memoRoom.previousRoomId;
    memoRoomDto.nextRoomId = memoRoom.nextRoomId;

    return memoRoomDto;
  }
}
