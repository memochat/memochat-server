import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath, isIgnoredEnvFile } from '../config-option';
import { S3ConfigService } from './config.service';
import { validate } from './validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      ignoreEnvFile: isIgnoredEnvFile(),
      validate,
    }),
  ],
  providers: [S3ConfigService],
  exports: [S3ConfigService],
})
export class S3ConfigModule {}
