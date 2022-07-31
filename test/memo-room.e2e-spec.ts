import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AccessToken } from './utils/access-token';
import { DataSource } from 'typeorm';
import { MemoRoomModule } from '../src/app/memo-room/memo-room.module';
import { getUser } from '../src/app/user/__test__/user.fixture';
import { AppConfigModule } from '../src/common/config/app/config.module';
import { DatabaseModule } from '../src/common/config/database/database.module';
import { JwtAuthModule } from '../src/common/modules/jwt-auth/jwt-auth.module';
import { setNestApp } from '../src/setNsetApp';
import { ErrorInfo } from '../src/common/exceptions/error-info';
import { InvalidTokenException } from '../src/common/exceptions/invalid-token.exception';
import { MemoRoom } from '../src/app/memo-room/memo-room.entity';
import { MemoRoomCatrgory } from '../src/app/memo-room/type/memo-room-category';

describe('MomoRoom E2E Test', () => {
  const route = '/v1/memo-rooms';
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppConfigModule, DatabaseModule, JwtAuthModule, MemoRoomModule],
    }).compile();

    app = module.createNestApplication();
    dataSource = module.get(DataSource);

    setNestApp(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Craete', () => {
    const url = `${route}`;

    test('메모룸 생성 후 201응답과 함께 생성된 메모룸 아이디를 응답하는가', async () => {
      // given
      const user = getUser();

      const em = dataSource.createEntityManager();

      await em.save(user);

      const accessToken = AccessToken.of(user);

      // when
      const res = await request(app.getHttpServer())
        .post(url)
        .set({ Authorization: accessToken.bearerForm })
        .send({ name: 'test', category: 'DEFAULT' });

      // then
      expect(res.status).toEqual(HttpStatus.CREATED);
      expect(res.body).toMatchObject({
        status: 'OK',
        message: '',
        data: {
          id: expect.any(Number),
        },
      });

      const memoRoom = await em.findOne(MemoRoom, { where: { user: { id: user.id } } });
      expect(memoRoom).toMatchObject({
        id: res.body.data.id,
        name: 'test',
        category: MemoRoomCatrgory.DEFAULT,
      });
    });

    test('토큰이 없는 경우 401을 응답하는가', async () => {
      // given
      const user = getUser();

      const em = dataSource.createEntityManager();

      await em.save(user);

      // when
      const res = await request(app.getHttpServer()).post(url).send({ name: 'test', category: 'DEFAULT' });

      // then
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
      const errorInfo = new InvalidTokenException().getResponse() as ErrorInfo<any>;
      expect(res.body).toMatchObject({
        status: errorInfo.errorCode,
        message: errorInfo.message,
      });
    });
  });
});
