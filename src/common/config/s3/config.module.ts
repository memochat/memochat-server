import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ConfigService } from './config.service';

@Module({
  imports: [ConfigModule],
  providers: [S3ConfigService],
  exports: [S3ConfigService],
})
export class S3ConfigModule {}
