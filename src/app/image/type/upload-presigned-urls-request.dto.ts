import { ApiProperty } from '@nestjs/swagger';
import { ImageType } from './image-type';
import { UploadPresignedUrlRequestDto } from './upload-presigned-url-request.dto';

export class UploadPresignedUrlsRequestDto extends UploadPresignedUrlRequestDto {
  @ApiProperty({ example: 5, description: '만들 presignedurl 개수' })
  count: number;

  toEntity() {
    return {
      type: ImageType.valueOf(this.type),
      count: this.count,
    };
  }
}
