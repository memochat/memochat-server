import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { ImageType } from './image-type';

export class UploadPresignedUrlRequestDto {
  @IsIn(ImageType.values().map((value) => value.code))
  @ApiProperty({ example: 'CHAT', description: '이미지 타입(USER_PROFILE, CHAT)' })
  type: string;

  @IsString({ each: true })
  @ApiProperty({ example: ['image/png', 'image/jpeg'], description: 'mime 타입들' })
  mimeTypes: string[];

  toEntity() {
    return {
      type: ImageType.valueOf(this.type),
      mimeTypes: this.mimeTypes,
    };
  }
}
