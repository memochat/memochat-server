import { S3Service } from '../../common/modules/s3/s3.service';
import { ImageType } from './type/image-type';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadPresignedUrl(type: ImageType) {
    const key = `${type.code.toLowerCase()}/${uuid()}.png`;
    const presignedUrl = await this.s3Service.presignForPut(`${type.code.toLowerCase()}/${uuid()}.png`);

    return { presignedUrl, imageKey: key };
  }

  async uploadPresignedUrls(type: ImageType, count: number) {
    return Promise.all(Array.from({ length: count }).map(() => this.uploadPresignedUrl(type)));
  }
}
