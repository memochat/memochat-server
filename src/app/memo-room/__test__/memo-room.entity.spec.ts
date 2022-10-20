import { Test } from '@nestjs/testing';
import { MemoRoom } from '../memo-room.entity';
import { DatabaseModule } from '../../../common/config/database/database.module';
import { DataSource } from 'typeorm';
import { getMemoRoom } from './memo-room.fixture';
import { getUser } from '../../user/__test__/user.fixture';
import { getRoomCategory } from './room-category.fixture';

describe('MemoRoom Entity Test', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    dataSource = module.get(DataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  test('create', async () => {
    // given
    const user = getUser();

    const roomCategory = getRoomCategory();

    const memoRoom = new MemoRoom();
    memoRoom.name = 'test';
    memoRoom.setUser(user);
    memoRoom.roomCategory = roomCategory;

    const em = dataSource.createEntityManager();
    await em.save(user);
    await em.save(roomCategory);

    // when
    await em.save(memoRoom);

    // then
    expect(memoRoom).toMatchObject({
      id: expect.any(Number),
      name: 'test',
      roomCategory: expect.objectContaining({
        ...roomCategory,
      }),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  test('read', async () => {
    // given
    const user = getUser();
    const roomCategory = getRoomCategory();

    const memoRoom = getMemoRoom({ user: Promise.resolve(user), roomCategory: roomCategory });

    const em = dataSource.createEntityManager();

    await em.save(user);
    await em.save(roomCategory);
    await em.save(memoRoom);

    // when
    const savedMemoRoom = await em.findOne(MemoRoom, { where: { id: memoRoom.id } });

    // then
    expect(savedMemoRoom).toMatchObject({
      id: memoRoom.id,
      name: memoRoom.name,
      roomCategory: expect.objectContaining({
        ...roomCategory,
      }),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(savedMemoRoom.user).resolves.toMatchObject(user);
  });
});
