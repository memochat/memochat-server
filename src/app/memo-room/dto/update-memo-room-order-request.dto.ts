import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateMemoRoomOrederRequest {
  @ApiProperty({ example: 1, description: '이전 룸 아이디(이전 룸이 없는 경우 0)', minimum: 0 })
  @IsNumber()
  @Min(0)
  previousRoomId: number;
}
