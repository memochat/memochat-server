import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlResponseDto {
  @ApiProperty({ example: 'chat/a95e6071-30a6-4864-900b-67b1fe74f934.png', description: '이미지 키(이미지 업로드 후 사용)' })
  key: string;

  @ApiProperty({
    example:
      'https://memochat-develop.s3.ap-northeast-2.amazonaws.com/chat/055534c7-08cf-4e8c-a7e3-46583636aee3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3ADKWL776KJR4DM2%2F20220823%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220823T144608Z&X-Amz-Expires=86400&X-Amz-Signature=02498b3d8f3157165d5bde175909dc3c5fbf49d29ffc03d41328f6989e7abc1a&X-Amz-SignedHeaders=host',
    description: 'presignedUrl',
  })
  url: string;

  constructor({ key, url }) {
    this.key = key;
    this.url = url;
  }
}
