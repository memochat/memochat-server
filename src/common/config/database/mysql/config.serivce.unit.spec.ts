import { Test } from '@nestjs/testing';
import { MySQLConfigModule } from './config.module';
import { MySQLConfigService } from './config.service';

describe('MYSQL Config Module Test', () => {
  let mysqlConfigService: MySQLConfigService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [MySQLConfigModule],
    }).compile();

    mysqlConfigService = app.get(MySQLConfigService);
  });

  describe('Postgre Config Service Test', () => {
    test('MYSQL_DB를  반환하는가', async () => {
      // given

      // when
      const dbname = mysqlConfigService.dbName;

      // then
      expect(dbname).toEqual(process.env.MYSQL_DB);
    });

    test('MYSQL_PORT를 반환하는가', async () => {
      // given

      // when
      const port = mysqlConfigService.port;

      // then
      expect(port).toEqual(parseInt(process.env.MYSQL_PORT, 10));
    });
    test('MYSQL_HOSTNAME 반환하는가', async () => {
      // given

      // when
      const hostName = mysqlConfigService.hostName;

      // then
      expect(hostName).toEqual(process.env.MYSQL_HOSTNAME);
    });
    test('MYSQL_USER를 반환하는가', async () => {
      // given

      // when
      const userName = mysqlConfigService.userName;

      // then
      expect(userName).toEqual(process.env.MYSQL_USER);
    });
    test('MYSQL_PASSWORD를 반환하는가', async () => {
      // given

      // when
      const password = mysqlConfigService.password;

      // then
      expect(password).toEqual(process.env.MYSQL_PASSWORD);
    });
  });
});
