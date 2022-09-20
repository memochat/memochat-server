import { S3Service } from '../../common/modules/s3/s3.service';
import { ImageType } from './type/image-type';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import MimeTypes from 'mime-types';

@Injectable()
export class ImageService {
  constructor(private readonly s3Service: S3Service) {}

  uploadPresignedUrl({ type, mimeTypes }: { type: ImageType; mimeTypes: string[] }) {
    const path = type.code.toLowerCase();

    return mimeTypes.map((mimeType) => {
      const key = `${path}/origin/${uuid()}.${MimeTypes.extension(mimeType)}`;
      const presignedUrl = this.s3Service.presignForPut(key, mimeType);

      return { presignedUrl, key };
    });
  }
}
