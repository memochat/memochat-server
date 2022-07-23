import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AuthModule } from '../src/app/auth/auth.module';
import { HashService } from '../src/app/auth/hash.service';
import { getUser } from '../src/app/user/__test__/user.fixture';
import { AppConfigModule } from '../src/common/config/app/config.module';
import { DatabaseModule } from '../src/common/config/database/database.module';
import { JwtAuthModule } from '../src/common/modules/jwt-auth/jwt-auth.module';
import { ResponseStatus } from '../src/common/response/response-status';
import { setNestApp } from '../src/setNsetApp';

describe('Auth Module E2E Test', () => {
  const route = '/v1/auth';
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppConfigModule, DatabaseModule, JwtAuthModule, AuthModule],
    }).compile();

    app = module.createNestApplication();
    dataSource = module.get(DataSource);

    setNestApp(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /v1/auth/signup', () => {
    const url = `${route}/signup`;

    test('해당하는 유저 정보가 생성되고 201을 반환하는가', async () => {
      // given
      const body = {
        email: 'test@test.com',
        password: '!a123456',
        nickname: 'test',
      };

      // when
      const response = await request(app.getHttpServer()).post(url).send(body);

      // then
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        status: 'OK',
        message: '',
        data: '',
      });
    });

    test('해당하는 이메일이 이미 존재하는 경우, AlreadyExistEmailException이 발생하는가', async () => {
      // given
      const user = getUser();
      const em = dataSource.createEntityManager();
      await em.save(user);

      const body = {
        email: user.email,
        password: '!a123456',
        nickname: 'test',
      };

      // when
      const response = await request(app.getHttpServer()).post(url).send(body);

      // then
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toMatchObject({
        status: ResponseStatus.ALREADY_EXIST_EMAIL,
        message: '이미 존재하는 이메일 입니다',
      });
    });
  });

  describe('POST /v1/auth/signin', () => {
    const url = `${route}/signin`;

    test('로그인 성공시, 토큰정보를 반환하는가', async () => {
      // given
      const password = '!a123456';
      const hashService = new HashService();
      const user = getUser({ password: await hashService.hash(password) });
      const em = dataSource.createEntityManager();
      await em.save(user);

      const body = {
        email: user.email,
        password,
      };

      // when
      const response = await request(app.getHttpServer()).post(url).send(body);

      // then
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        status: ResponseStatus.OK,
        message: '',
        data: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          userId: user.id,
        },
      });
    });

    test('해당하는 이메일의 유저가 존재하지 않는 경우 UserNotFoundException이 발생하는가', async () => {
      // given
      const body = {
        email: 'test@test.com',
        password: '!a123456',
      };

      // when
      const response = await request(app.getHttpServer()).post(url).send(body);

      // then
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        status: ResponseStatus.USER_NOT_FOUND,
        message: '해당하는 유저가 존재하지 않습니다',
      });
    });
  });
});
