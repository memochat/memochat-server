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
    test('해당하는 유저의 첫번째 메모룸이 생성 되는가', async () => {
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

    test('해당하는 유저의 여러개의 메모룸이 순서에 맞게 생성 되는가', async () => {
      // given
      const user = getUser();

      await em.save(user);

      // when
      await memoRoomService.create({ user, name: 'first', roomTypeId: 1 });
      await memoRoomService.create({ user, name: 'second', roomTypeId: 1 });
      await memoRoomService.create({ user, name: 'third', roomTypeId: 1 });

      // then
      const memoRooms = await em.find(MemoRoom, {
        where: { user: { id: user.id } },
        relations: { previousRoom: true, nextRoom: true },
      });
      expect(memoRooms).toHaveLength(3);

      const firstMemoRoom = memoRooms.find((v) => v.name === 'first');
      const secondMemoRoom = memoRooms.find((v) => v.name === 'second');
      const thirdMemoRoom = memoRooms.find((v) => v.name === 'third');

      expect(firstMemoRoom).toMatchObject(secondMemoRoom.nextRoom);
      expect(firstMemoRoom.nextRoom).toBeNull();
      expect(secondMemoRoom).toMatchObject(firstMemoRoom.previousRoom);
      expect(secondMemoRoom).toMatchObject(thirdMemoRoom.nextRoom);
      expect(thirdMemoRoom).toMatchObject(secondMemoRoom.previousRoom);
      expect(thirdMemoRoom.previousRoom).toBeNull();
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

  describe('delete', () => {
    test('해당하는 메모룸이 삭제되는가', async () => {
      // given
      const user = getUser();

      await em.save(user);

      const firstRoom = getMemoRoom({ user: Promise.resolve(user), roomType: roomTypes[0] });
      const secondRoom = getMemoRoom({ user: Promise.resolve(user), roomType: roomTypes[0] });
      const thirdRoom = getMemoRoom({ user: Promise.resolve(user), roomType: roomTypes[0] });

      await em.save([firstRoom, secondRoom, thirdRoom]);

      firstRoom.nextRoomId = secondRoom.id;
      secondRoom.previousRoomId = firstRoom.id;
      secondRoom.nextRoomId = thirdRoom.id;
      thirdRoom.previousRoomId = secondRoom.id;

      await em.save([firstRoom, secondRoom, thirdRoom]);

      // when
      await memoRoomService.delete({ user, memoRoomId: secondRoom.id });

      // then
      const memoRooms = await em.findBy(MemoRoom, { user: { id: user.id } });
      expect(memoRooms).toHaveLength(3);

      const savedFirstRoom = memoRooms.find((v) => v.id === firstRoom.id);
      const savedSecondRoom = memoRooms.find((v) => v.id === secondRoom.id);
      const savedThirdRoom = memoRooms.find((v) => v.id === thirdRoom.id);

      expect(savedSecondRoom).toMatchObject({
        id: secondRoom.id,
        name: secondRoom.name,
        deletedAt: expect.any(Date),
        previousRoomId: null,
        nextRoomId: null,
      });
      expect(savedFirstRoom).toMatchObject({
        id: firstRoom.id,
        name: firstRoom.name,
        deletedAt: null,
        previousRoomId: null,
        nextRoomId: thirdRoom.id,
      });
      expect(savedThirdRoom).toMatchObject({
        id: thirdRoom.id,
        name: thirdRoom.name,
        deletedAt: null,
        previousRoomId: firstRoom.id,
        nextRoomId: null,
      });
    });
  });
});
