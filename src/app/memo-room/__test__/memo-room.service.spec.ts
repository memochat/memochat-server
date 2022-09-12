import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { DatabaseModule } from '../../../common/config/database/database.module';
import { RoomTypeNotFoundException } from '../../../common/exceptions/room-type-not-found.exception';
import { TooManyMemoRoomsException } from '../../../common/exceptions/too-many-memorooms.exception';
import { getUser } from '../../user/__test__/user.fixture';
import { MemoRoom } from '../memo-room.entity';
import { MemoRoomRepository } from '../memo-room.repository';
import { MemoRoomService } from '../memo-room.service';
import { RoomTypeRepository } from '../room-type.repository';
import { getMemoRoom } from './memo-room.fixture';
import { getInitialRoomTypes } from './room-type.fixture';

describe('Memo Room Service Test', () => {
  const roomTypes = getInitialRoomTypes();

  let memoRoomService: MemoRoomService;
  let dataSource: DataSource;
  let em: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [MemoRoomRepository, RoomTypeRepository, MemoRoomService],
    }).compile();

    memoRoomService = module.get(MemoRoomService);
    dataSource = module.get(DataSource);
    em = dataSource.createEntityManager();

    await em.save(roomTypes);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  describe('create', () => {
    test('해당하는 유저의 메모룸이 생성 되는가', async () => {
      // given
      const user = getUser();

      await em.save(user);

      // when
      const savedMemoRoom = await memoRoomService.create({ user, name: 'test', roomTypeId: 1 });

      // then
      expect(savedMemoRoom).toMatchObject({
        id: expect.any(Number),
        name: 'test',
        roomType: roomTypes.find((roomType) => roomType.id === 1),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    test('해당하는 룸타입이 존재하지 않는 경우 RoomTypeNotFoundException이 발생하는가', async () => {
      // given
      const user = getUser();

      // when
      const result = memoRoomService.create({ user, name: 'test', roomTypeId: 9999 });

      // then
      expect(result).rejects.toThrowError(RoomTypeNotFoundException);
    });

    test('총 룸 개수가 최대 룸개수를 초과하는 경우 TooManyMemoRoomsException이 발생하는가', async () => {
      // given
      const user = getUser();
      await em.save(user);

      const memoRooms = Array.from({ length: MemoRoom.MAX_ROOM_COUNT }, (v, k) => k).map((v) =>
        getMemoRoom({ user: Promise.resolve(user), roomType: roomTypes[v % roomTypes.length] }),
      );

      await em.save(memoRooms);

      // when
      const result = memoRoomService.create({ user, name: 'test', roomTypeId: 1 });

      // then
      expect(result).rejects.toThrowError(TooManyMemoRoomsException);
    });
  });
});
