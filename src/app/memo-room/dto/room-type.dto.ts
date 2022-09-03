import { ApiProperty } from '@nestjs/swagger';

export class RoomTypeDto {
  @ApiProperty({ example: 1, description: '룸 유형 아이디' })
  id: number;

  @ApiProperty({ example: 'DEFAULT', description: '룸 유형 카테고리' })
  category: string;

  @ApiProperty({ example: 'test.png', description: '룸 유형 썸네일' })
  thumbnail: string;
}
