import { Test } from '@nestjs/testing';
import { MemoRoom } from '../memo-room.entity';
import { MemoRoomCatrgory } from '../type/memo-room-category';
import { DatabaseModule } from '../../../common/config/database/database.module';
import { DataSource } from 'typeorm';
import { getMemoRoom } from './memo-room.fixture';

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
    const memoRoom = new MemoRoom();
    memoRoom.name = 'test';
    memoRoom.category = MemoRoomCatrgory.DEFAULT;

    const em = dataSource.createEntityManager();

    // when
    await em.save(memoRoom);

    // then
    expect(memoRoom).toMatchObject({
      id: expect.any(Number),
      name: 'test',
      category: MemoRoomCatrgory.DEFAULT,
      isPinned: false,
      image: '',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  test('read', async () => {
    // given
    const memoRoom = getMemoRoom();
    const em = dataSource.createEntityManager();

    await em.save(memoRoom);

    // when
    const savedMemoRoom = await em.findOne(MemoRoom, { where: { id: memoRoom.id } });

    // then

    expect(savedMemoRoom).toMatchObject({
      ...memoRoom,
    });
  });
});
