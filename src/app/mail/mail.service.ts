import fetch from 'node-fetch';
import FormData from 'form-data';
import { Injectable } from '@nestjs/common';
import { MailConfigService } from 'src/common/config/mail/config.service';
import { EmailVar } from './mail.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailConfigService: MailConfigService) {}

  async sendEmail(subject: string, template: string, to: string, emailVars: EmailVar[]): Promise<boolean> {
    const form = new FormData();
    form.append('from', `Memochat <memochat@memochat.com>`); // from-email 협의 후 수정?
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((emailVar) => form.append(`v:${emailVar.key}`, emailVar.value));

    try {
      const response = await fetch(`${this.mailConfigService.mailgunDomainName}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${this.mailConfigService.mailgunApiKey}`).toString('base64')}`,
        },
        body: form,
      });
      console.log(response.body);

      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'verify-email', email, [{ key: 'code', value: code }]);
  }
}
