import { Test } from '@nestjs/testing';
import { JwtConfigModule } from './config.module';
import { JwtConfigService } from './config.service';

describe('JWT Config Module Test', () => {
  let jwtConfigService: JwtConfigService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [JwtConfigModule],
    }).compile();

    jwtConfigService = app.get(JwtConfigService);
  });

  describe('JWT Config Service Test', () => {
    test('JWT_ACCESS_EXPIRATION_MINUTES를 반환하는가', async () => {
      // given

      // when
      const accessTokenExpireMinutes = jwtConfigService.accessTokenExpireMinutes;

      // then
      expect(accessTokenExpireMinutes).toEqual(parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 10));
    });

    test('JWT_REFRESH_EXPIRATION_DAYS를 반환하는가', async () => {
      // given

      // when
      const refreshTokenExpireDays = jwtConfigService.refreshTokenExpireDays;

      // then
      expect(refreshTokenExpireDays).toEqual(parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS, 10));
    });
    test('JWT_SECRET를 반환하는가', async () => {
      // given

      // when
      const secret = jwtConfigService.secret;

      // then
      expect(secret).toEqual(process.env.JWT_SECRET);
    });
  });
});
