import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteMemoChatDto {
  @ApiProperty({ example: '22', description: '삭제할 메모챗이 속한 메모룸의 Id 입니다.' })
  @Type(() => Number)
  @IsNumber()
  roomId: number;

  @ApiProperty({ example: '38', description: '삭제할 메모챗의 Id 입니다.' })
  @Type(() => Number)
  @IsNumber()
  id: number;
}
