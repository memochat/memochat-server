import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppConfigService } from '../../app/config.service';
import { MySQLConfigService } from '../mysql/config.service';
import path from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private readonly MySQLConfigService: MySQLConfigService,
    private readonly appConfigService: AppConfigService,
  ) {}

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const entityPath = path.resolve(__dirname, '../../../../**/*.entity.{js,ts}');

    if (this.appConfigService.isDevelopment() || this.appConfigService.isTest()) {
      return {
        type: 'mysql',
        host: this.MySQLConfigService.hostName,
        port: this.MySQLConfigService.port,
        username: this.MySQLConfigService.userName,
        password: this.MySQLConfigService.password,
        database: this.MySQLConfigService.dbName,
        logging: this.appConfigService.isDevelopment() ? 'all' : ['error', 'warn'],
        entities: [entityPath],
        dropSchema: this.appConfigService.isTest(),
        synchronize: !this.appConfigService.isProduction(),
        namingStrategy: new SnakeNamingStrategy(),
        // 단순히 Slow query를 찍어주기만 하고 커넥션을 끊지 않음.
        // 찾아본 결과 mysql 기준 현재 커넥션 타임아웃이 불가능. DB 드라이버 자체에 따라 커넥션 타임아웃이 가능하기도 함.
        // maxQueryExecutionTime: this.MySQLConfigService.maxConnectionTimeout,
      };
    } else {
      return {
        type: 'mysql',
        host: this.MySQLConfigService.hostName,
        port: this.MySQLConfigService.port,
        username: this.MySQLConfigService.userName,
        password: this.MySQLConfigService.password,
        database: this.MySQLConfigService.dbName,
        logging: this.appConfigService.isDevelopment() ? 'all' : ['error', 'warn'],
        entities: [entityPath],
        dropSchema: this.appConfigService.isTest(),
        synchronize: !this.appConfigService.isProduction(),
        namingStrategy: new SnakeNamingStrategy(),
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }
  }
}
