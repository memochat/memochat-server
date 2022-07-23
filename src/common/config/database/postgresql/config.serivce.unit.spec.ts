import { Test } from '@nestjs/testing';
import { MysqlConfigModule } from './config.module';
import { MysqlConfigService } from './config.service';

describe('MySQL Config Module Test', () => {
  let mysqlConfigService: MysqlConfigService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [MysqlConfigModule],
    }).compile();

    mysqlConfigService = app.get(MysqlConfigService);
  });

  describe('MySQL Config Service Test', () => {
    test('MYSQL_DATABASE를 반환하는가', async () => {
      // given

      // when
      const dbname = mysqlConfigService.dbName;

      // then
      expect(dbname).toEqual(process.env.MYSQL_DATABASE);
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
    test('MYSQL_USERNAME를 반환하는가', async () => {
      // given

      // when
      const userName = mysqlConfigService.userName;

      // then
      expect(userName).toEqual(process.env.MYSQL_USERNAME);
    });
    test('MYSQL_PASSWORD를 반환하는가', async () => {
      // given

      // when
      const password = mysqlConfigService.passwrod;

      // then
      expect(password).toEqual(process.env.MYSQL_PASSWORD);
    });
    test('MYSQL_CONNECTION_TIMEOUT를 반환하는가', async () => {
      // given

      // when
      const maxConnectionTimeout = mysqlConfigService.maxConnectionTimeout;

      // then
      expect(maxConnectionTimeout).toEqual(parseInt(process.env.MYSQL_CONNECTION_TIMEOUT, 10));
    });
  });
});
