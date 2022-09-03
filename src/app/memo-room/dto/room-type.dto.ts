import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '../room-type.entity';

export class RoomTypeDto {
  @ApiProperty({ example: 1, description: '룸 유형 아이디' })
  id: number;

  @ApiProperty({ example: 'DEFAULT', description: '룸 유형 카테고리' })
  category: string;

  @ApiProperty({ example: 'test.png', description: '룸 유형 썸네일' })
  thumbnail: string;

  static of(roomType: RoomType) {
    const roomTypeDto = new RoomTypeDto();
    roomTypeDto.id = roomType.id;
    roomTypeDto.category = roomType.category.name;
    roomTypeDto.thumbnail = roomType.thumbnail;
    return roomTypeDto;
  }
}
