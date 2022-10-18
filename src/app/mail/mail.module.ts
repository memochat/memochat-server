import { Global, Module } from '@nestjs/common';
import { MailConfigModule } from '../../common/config/mail/config.module';
import { MailService } from './mail.service';

@Module({
  imports: [MailConfigModule],
  providers: [MailService],
  exports: [MailService],
})
@Global()
export class MailModule {}
