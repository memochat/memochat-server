import { Expose, plainToClass } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class MailConfig {
  @Expose()
  @IsString()
  MAILGUN_API_KEY: string;

  @Expose()
  @IsString()
  MAILGUN_DOMAIN_NAME: string;

  @Expose()
  @IsString()
  MAILGUN_FROM_EAMIL: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(
    MailConfig,
    { ...config },
    { enableImplicitConversion: true, excludeExtraneousValues: true },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
