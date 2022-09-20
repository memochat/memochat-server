import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath, isIgnoredEnvFile } from '../config-option';
import { MailConfigService } from './config.service';
import { validate } from './validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      ignoreEnvFile: isIgnoredEnvFile(),
      validate,
    }),
  ],
  providers: [MailConfigService],
  exports: [MailConfigService],
})
export class MailConfigModule {}
