import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppConfigService } from './common/config/app/config.service';
import { BadParameterException } from './common/exceptions/bad-parameter.exception';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ErrorLoggerInterceptor } from './common/interceptors/error-logger.interceptor';

export function setNestApp(app: INestApplication) {
  // TODO: 클라이언트 origin 설정필요
  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalFilters(new AllExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadParameterException(Object.values(validationErrors[0].constraints).join(', '));
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableShutdownHooks();

  const appConfigService = app.get(AppConfigService);

  if (appConfigService.isDevelopment()) {
    app.useGlobalInterceptors(new ErrorLoggerInterceptor());
  }
}
