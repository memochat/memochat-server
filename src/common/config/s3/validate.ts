import { Expose, plainToClass } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class S3Config {
  @Expose()
  @IsString()
  S3_ACCESS_KEY: string;

  @Expose()
  @IsString()
  S3_SECRET_ACCESS_KEY: string;

  @Expose()
  @IsString()
  S3_REGION: string;

  @Expose()
  @IsString()
  S3_IMAGE_BUCKET_NAME: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(
    S3Config,
    { ...config },
    { enableImplicitConversion: true, excludeExtraneousValues: true },
  );

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
