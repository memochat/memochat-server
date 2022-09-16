import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '../room-type.entity';

export class RoomTypeDto {
  @ApiProperty({ example: 1, description: '룸 유형 아이디' })
  id: number;

  @ApiProperty({ example: 'DEFAULT', description: '룸 유형 카테고리' })
  category: string;

  @ApiProperty({
    example:
      'https://memochat-develop.s3.ap-northeast-2.amazonaws.com/test.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3ADKWL776KJR4DM2%2F20220916%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220916T145339Z&X-Amz-Expires=86400&X-Amz-Signature=a8fc1c0878c9e1e3f6530aeb1e2945ff29b006500eb059de9823ea625ca8d17a&X-Amz-SignedHeaders=host',
    description: '룸 유형 썸네일',
  })
  thumbnail: string;

  static of(roomType: RoomType) {
    const roomTypeDto = new RoomTypeDto();
    roomTypeDto.id = roomType.id;
    roomTypeDto.category = roomType.category.name;
    roomTypeDto.thumbnail = roomType.thumbnail;
    return roomTypeDto;
  }
}
