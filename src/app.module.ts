import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from './common/config/app/config.module';
import { DatabaseModule } from './common/config/database/database.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { JwtAuthModule } from './common/modules/jwt-auth/jwt-auth.module';
import { AppConfigService } from './common/config/app/config.service';
import { ApiSuccessLoggerMiddleware } from './common/middlewares/api-success-logger.middleware';
import { ApiErrorLoggerMiddleware } from './common/middlewares/api-error-logger.middleware';

@Module({
  imports: [AppConfigModule, DatabaseModule, JwtAuthModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly appConfigService: AppConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    if (!this.appConfigService.isTest()) {
      consumer.apply(ApiSuccessLoggerMiddleware, ApiErrorLoggerMiddleware).forRoutes('*');
    }
  }
}
