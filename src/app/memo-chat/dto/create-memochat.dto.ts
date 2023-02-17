import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { MemoChatCategory } from '../type/memo-chat-category';

export class CreateMemoChatDto {
  @IsNumber()
  @ApiProperty({ example: 'roomId', description: '메모룸 Id' })
  roomId: number;

  @IsString()
  @ApiProperty({ example: 'type', description: '메모챗 타입 TEXT | LINK' })
  type: MemoChatCategory;

  @IsString()
  @ApiProperty({ example: '채팅 전송', description: '메시지 내용입니다.' })
  message: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'www.naver.com', description: 'Link URL' })
  link?: string;
}
