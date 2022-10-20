import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateMemoRoomRequest {
  @IsString()
  @Length(2, 20)
  @ApiProperty({ example: '장보기목록', description: '메모룸 이름' })
  name: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 1, description: '메모룸 카테고리 아이디' })
  roomCategoryId: number;
}
