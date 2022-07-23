import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../app/config.module';
import { PostgreSQLConfigModule } from '../postgresql/config.module';
import { TypeOrmConfigService } from './config.service';

@Module({
  imports: [PostgreSQLConfigModule, AppConfigModule],
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
})
export class TypeOrmConfigModule {}
