import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetAllMemoChatDto {
  @IsNumber()
  @ApiProperty({ example: '20', description: '한 번에 가져올 메모챗의 개수', default: 20 })
  limit: number;

  @IsNumber()
  @ApiProperty({
    example: '1',
    description: '한 번에 가져올 메모챗의 페이지 넘버입니다. 기본적인 단위는 20 입니다. 1부터 시작',
  })
  offset: number;
}
