import { Test } from '@nestjs/testing';
import { S3ConfigModule } from './config.module';
import { S3ConfigService } from './config.service';

describe('S3 Config Module Test', () => {
  let s3ConfigService: S3ConfigService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [S3ConfigModule],
    }).compile();

    s3ConfigService = app.get(S3ConfigService);
  });

  describe('S3 Config Service Test', () => {
    test('S3_ACCESS_KEY를 반환하는가', async () => {
      // given

      // when
      const accessKey = s3ConfigService.accessKey;

      // then
      expect(accessKey).toBeDefined();
      expect(accessKey).toEqual(process.env.S3_ACCESS_KEY);
    });

    test('S3_SECRET_ACCESS_KEY를 반환하는가', async () => {
      // given

      // when
      const secretAccessKey = s3ConfigService.secretAccessKey;

      // then
      expect(secretAccessKey).toBeDefined();
      expect(secretAccessKey).toEqual(process.env.S3_SECRET_ACCESS_KEY);
    });
    test('S3_REGION를 반환하는가', async () => {
      // given

      // when
      const region = s3ConfigService.region;

      // then
      expect(region).toBeDefined();
      expect(region).toEqual(process.env.S3_REGION);
    });
    test('S3_IMAGE_BUCKET_NAME를 반환하는가', async () => {
      // given

      // when
      const imageBucketName = s3ConfigService.imageBucket;

      // then
      expect(imageBucketName).toBeDefined();
      expect(imageBucketName).toEqual(process.env.S3_IMAGE_BUCKET_NAME);
    });
  });
});
