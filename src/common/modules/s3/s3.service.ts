import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { S3ConfigService } from '../../config/s3/config.service';

@Injectable()
export class S3Service {
  private static readonly PUT_OBJECT_PRESIGNED_URL_EXPIRES = 24 * 60 * 60;
  private static readonly GET_OBJECT_PRESIGNED_URL_EXPIRES = 24 * 60 * 60;
  private static readonly POST_OBJECT_PRESIGNED_URL_EXPIRES = 60;

  private s3: S3;

  constructor(private readonly s3ConfigService: S3ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.s3ConfigService.accessKey,
      secretAccessKey: this.s3ConfigService.secretAccessKey,
      region: this.s3ConfigService.region,
    });
  }

  public presignForPut(key: string, type: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.s3ConfigService.imageBucket,
      Key: key,
      Expires: S3Service.PUT_OBJECT_PRESIGNED_URL_EXPIRES,
      ContentType: type,
    });
  }

  public presignForGet(key: string) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.s3ConfigService.imageBucket,
      Key: key,
      Expires: S3Service.GET_OBJECT_PRESIGNED_URL_EXPIRES,
    });
  }

  public getSignedUrl(key: string) {
    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(
        {
          Bucket: this.s3ConfigService.imageBucket,
          Fields: {
            key,
          },
          Expires: S3Service.POST_OBJECT_PRESIGNED_URL_EXPIRES,
          Conditions: [
            ['content-length-range', 0, 20 * 1024 * 1024],
            ['starts-with', '$Content-Type', 'image/'],
          ],
        },
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        },
      );
    });
  }
}
