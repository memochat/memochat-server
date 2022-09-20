import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Config } from './validate';

@Injectable()
export class S3ConfigService {
  constructor(private readonly configService: ConfigService<S3Config, true>) {}

  get accessKey() {
    return this.configService.get('S3_ACCESS_KEY', { infer: true });
  }

  get secretAccessKey() {
    return this.configService.get('S3_SECRET_ACCESS_KEY', { infer: true });
  }

  get region() {
    return this.configService.get('S3_REGION', { infer: true });
  }

  get imageBucket() {
    return this.configService.get('S3_IMAGE_BUCKET_NAME', { infer: true });
  }
}
