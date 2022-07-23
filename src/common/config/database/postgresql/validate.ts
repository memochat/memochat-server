import { Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export class PostgreSQLConfig {
  @Expose()
  @IsString()
  POSTGRES_HOSTNAME: string;

  @Expose()
  @IsString()
  POSTGRES_USER: string;

  @Expose()
  @IsString()
  POSTGRES_PASSWORD: string;

  @Expose()
  @IsNumber()
  POSTGRES_PORT: number;

  @Expose()
  @IsString()
  POSTGRES_DB: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(
    PostgreSQLConfig,
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
