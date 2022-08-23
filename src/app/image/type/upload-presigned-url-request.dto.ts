import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { ImageType } from './image-type';

export class UploadPresignedUrlRequestDto {
  @IsIn(ImageType.values().map((value) => value.code))
  @ApiProperty({ example: 'CHAT', description: '이미지 타입(USER_PROFILE, CHAT)' })
  type: string;

  toEntity() {
    return {
      type: ImageType.valueOf(this.type),
    };
  }
}
