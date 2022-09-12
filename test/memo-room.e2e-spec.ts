import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AccessToken } from './utils/access-token';
import { DataSource, EntityManager } from 'typeorm';
import { MemoRoomModule } from '../src/app/memo-room/memo-room.module';
import { getUser } from '../src/app/user/__test__/user.fixture';
import { AppConfigModule } from '../src/common/config/app/config.module';
import { DatabaseModule } from '../src/common/config/database/database.module';
import { JwtAuthModule } from '../src/common/modules/jwt-auth/jwt-auth.module';
import { setNestApp } from '../src/setNsetApp';
import { ErrorInfo } from '../src/common/exceptions/error-info';
import { InvalidTokenException } from '../src/common/exceptions/invalid-token.exception';
import { MemoRoom } from '../src/app/memo-room/memo-room.entity';
import { getInitialRoomTypes } from '../src/app/memo-room/__test__/room-type.fixture';
import { RoomTypeNotFoundException } from '../src/common/exceptions/room-type-not-found.exception';
import { getMemoRoom } from '../src/app/memo-room/__test__/memo-room.fixture';
import { TooManyMemoRoomsException } from '../src/common/exceptions/too-many-memorooms.exception';

describe('MomoRoom E2E Test', () => {
  const roomTypes = getInitialRoomTypes();
  const route = '/v1/memo-rooms';
  let app: INestApplication;
  let dataSource: DataSource;
  let em: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppConfigModule, DatabaseModule, JwtAuthModule, MemoRoomModule],
    }).compile();

    app = module.createNestApplication();
    dataSource = module.get(DataSource);
    em = dataSource.createEntityManager();

    setNestApp(app);

    await app.init();

    await em.save(roomTypes);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /v1/memo-rooms', () => {
    const url = `${route}`;

    test('메모룸 생성 후 201응답과 함께 생성된 메모룸 아이디를 응답하는가', async () => {
      // given
      const user = getUser();

      await em.save(user);

      const accessToken = AccessToken.of(user);

      // when
      const res = await request(app.getHttpServer())
        .post(url)
        .set({ Authorization: accessToken.bearerForm })
        .send({ name: 'test', roomTypeId: 1 });

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
        roomType: roomTypes.find((roomType) => roomType.id === 1),
      });
    });

    test('토큰이 없는 경우 401을 응답하는가', async () => {
      // given
      const user = getUser();

      await em.save(user);

      // when
      const res = await request(app.getHttpServer()).post(url).send({ name: 'test', category: 'DEFAULT' });

      // then
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
      const errorInfo = new InvalidTokenException().getResponse() as ErrorInfo<any>;
      expect(res.body).toMatchObject({
        status: errorInfo.errorCode,
      });
    });

    test('roomTypeId에 해당하는 룸 유형이 존재하지 않는 경우 404를 응답하는가', async () => {
      // given
      const user = getUser();

      await em.save(user);

      const accessToken = AccessToken.of(user);

      // when
      const res = await request(app.getHttpServer()).post(url).set({ Authorization: accessToken.bearerForm }).send({
        name: 'test',
        roomTypeId: 999,
      });

      // then
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
      const errorInfo = new RoomTypeNotFoundException().getResponse() as ErrorInfo<any>;
      expect(res.body).toMatchObject({
        status: errorInfo.errorCode,
      });
    });

    test('최대 생성할 수 있는 메모룸 개수를 초과하는 경우 400에러를 반환하는가', async () => {
      // given
      const user = getUser();

      await em.save(user);

      const memoRooms = Array.from({ length: MemoRoom.MAX_ROOM_COUNT }, (v, k) => k).map((v) =>
        getMemoRoom({ user: Promise.resolve(user), roomType: roomTypes[v % roomTypes.length] }),
      );

      await em.save(memoRooms);

      const accessToken = AccessToken.of(user);

      // when
      const res = await request(app.getHttpServer()).post(url).set({ Authorization: accessToken.bearerForm }).send({
        name: 'test',
        roomTypeId: 1,
      });

      // then
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
      const errorInfo = new TooManyMemoRoomsException().getResponse() as ErrorInfo<any>;
      expect(res.body).toMatchObject({
        status: errorInfo.errorCode,
      });
    });
  });
});
