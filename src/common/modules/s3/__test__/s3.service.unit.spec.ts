import { Test } from '@nestjs/testing';
import { S3ConfigModule } from '../../../config/s3/config.module';
import { S3Service } from '../s3.service';

describe('S3 Service Test', () => {
  let s3Service: S3Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [S3ConfigModule],
      providers: [S3Service],
    }).compile();

    s3Service = module.get(S3Service);
  });

  test('upload를 위한 presignedURL이 생성되는가', async () => {
    // given
    const key = 'test.png';

    // when
    const result = await s3Service.presignForPut(key);

    // then
    expect(result).toEqual(expect.any(String));
  });

  test('read를 위한 presignedURL이 생성되는가', async () => {
    // given
    const key = 'test.png';

    // when
    const result = await s3Service.presignForGet(key);

    // then
    expect(result).toEqual(expect.any(String));
  });
});
