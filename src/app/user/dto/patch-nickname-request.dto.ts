import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PathNicknameRequestDto {
  @ApiProperty({ example: 'updated_nickname' })
  @IsString()
  nickname: string;
}
