import { Module } from '@nestjs/common';
import { S3ConfigModule } from '../../config/s3/config.module';
import { S3Service } from './s3.service';

@Module({
  imports: [S3ConfigModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
