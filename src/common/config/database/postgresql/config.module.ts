import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath, isIgnoredEnvFile } from '../../config-option';
import { PostgreSQLConfigService } from './config.service';
import { validate } from './validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      ignoreEnvFile: isIgnoredEnvFile(),
      validate,
    }),
  ],
  providers: [PostgreSQLConfigService],
  exports: [PostgreSQLConfigService],
})
export class PostgreSQLConfigModule {}
