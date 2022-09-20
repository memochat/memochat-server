import { Test } from '@nestjs/testing';
import { PostgreSQLConfigModule } from './config.module';
import { PostgreSQLConfigService } from './config.service';

describe('Postgres Config Module Test', () => {
  let postgreConfigService: PostgreSQLConfigService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [PostgreSQLConfigModule],
    }).compile();

    postgreConfigService = app.get(PostgreSQLConfigService);
  });

  describe('Postgre Config Service Test', () => {
    test('POSTGRES_DB를  반환하는가', async () => {
      // given

      // when
      const dbname = postgreConfigService.dbName;

      // then
      expect(dbname).toEqual(process.env.POSTGRES_DB);
    });

    test('POSTGRES_PORT를 반환하는가', async () => {
      // given

      // when
      const port = postgreConfigService.port;

      // then
      expect(port).toEqual(parseInt(process.env.POSTGRES_PORT, 10));
    });
    test('POSTGRES_HOSTNAME 반환하는가', async () => {
      // given

      // when
      const hostName = postgreConfigService.hostName;

      // then
      expect(hostName).toEqual(process.env.POSTGRES_HOSTNAME);
    });
    test('POSTGRES_USER를 반환하는가', async () => {
      // given

      // when
      const userName = postgreConfigService.userName;

      // then
      expect(userName).toEqual(process.env.POSTGRES_USER);
    });
    test('POSTGRES_PASSWORD를 반환하는가', async () => {
      // given

      // when
      const password = postgreConfigService.password;

      // then
      expect(password).toEqual(process.env.POSTGRES_PASSWORD);
    });
  });
});
