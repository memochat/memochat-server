import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from './validate';

@Injectable()
export class MailConfigService {
  constructor(private readonly configService: ConfigService<MailConfig, true>) {}

  get mailgunApiKey() {
    return this.configService.get('MAILGUN_API_KEY', { infer: true });
  }

  get mailgunDomainName() {
    return this.configService.get('MAILGUN_DOMAIN_NAME', { infer: true });
  }

  get mailgunFromEmail() {
    return this.configService.get('MAILGUN_FROM_EAMIL', { infer: true });
  }
}
