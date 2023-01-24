import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../app/config.module';
import { MySQLConfigModule } from '../mysql/config.module';
import { TypeOrmConfigService } from './config.service';

@Module({
  imports: [MySQLConfigModule, AppConfigModule],
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
})
export class TypeOrmConfigModule {}
