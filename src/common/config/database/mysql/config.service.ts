import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MySQLConfig } from './validate';

@Injectable()
export class MySQLConfigService {
  constructor(private readonly configService: ConfigService<MySQLConfig, true>) {}

  get hostName() {
    return this.configService.get('MYSQL_HOSTNAME', { infer: true });
  }

  get userName() {
    return this.configService.get('MYSQL_USER', { infer: true });
  }

  get password() {
    return this.configService.get('MYSQL_PASSWORD', { infer: true });
  }

  get port() {
    return this.configService.get('MYSQL_PORT', { infer: true });
  }

  get dbName() {
    return this.configService.get('MYSQL_DB', { infer: true });
  }
  // get maxConnectionTimeout() {
  //   return this.configService.get('MYSQL_CONNECTION_TIMEOUT', { infer: true });
  // }
}
