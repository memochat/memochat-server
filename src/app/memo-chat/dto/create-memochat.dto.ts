import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateMemoChatDto {
  @IsString()
  @ApiProperty({ example: 'type', description: '메모챗 타입 TEXT | LINK | PHOTO' })
  type: string;

  @IsString()
  @ApiProperty({ example: '채팅 전송', description: '메시지 내용입니다.' })
  message: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'www.naver.com', description: 'Link URL' })
  link?: string;
}
