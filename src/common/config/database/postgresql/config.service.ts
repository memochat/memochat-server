import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgreSQLConfig } from './validate';

@Injectable()
export class PostgreSQLConfigService {
  constructor(private readonly configService: ConfigService<PostgreSQLConfig, true>) {}

  get hostName() {
    return this.configService.get('POSTGRES_HOSTNAME', { infer: true });
  }

  get userName() {
    return this.configService.get('POSTGRES_USER', { infer: true });
  }

  get password() {
    return this.configService.get('POSTGRES_PASSWORD', { infer: true });
  }

  get port() {
    return this.configService.get('POSTGRES_PORT', { infer: true });
  }

  get dbName() {
    return this.configService.get('POSTGRES_DB', { infer: true });
  }
  // get maxConnectionTimeout() {
  //   return this.configService.get('POSTGRES_CONNECTION_TIMEOUT', { infer: true });
  // }
}
