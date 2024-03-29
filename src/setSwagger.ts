import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MemoRoomModule } from './app/memo-room/memo-room.module';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { ImageModule } from './app/image/image.module';
import { UserModule } from './app/user/user.module';
import { AppConfigService } from './common/config/app/config.service';
import { ResponseEntity } from './common/response/response-entity';
import { MemoChatModule } from './app/memo-chat/memo-chat.module';

export const setSwagger = (app: INestApplication) => {
  const appConfigService = app.get(AppConfigService);

  const config = new DocumentBuilder()
    .setTitle('MemoChat REST API')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${appConfigService.port}/v1`)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, UserModule, MailModule, ImageModule, MemoRoomModule, MemoChatModule],
    extraModels: [ResponseEntity],
  });

  SwaggerModule.setup('/v1/docs', app, document, {
    swaggerOptions: {
      operationsSorter: (a: any, b: any) => {
        const methodsOrder = ['post', 'put', 'patch', 'get', 'delete', 'options', 'trace'];
        let result = methodsOrder.indexOf(a.get('method')) - methodsOrder.indexOf(b.get('method'));

        if (result === 0) {
          result = a.get('path').localeCompare(b.get('path'));
        }

        return result;
      },
      persistAuthorization: true,
    },
  });
};
