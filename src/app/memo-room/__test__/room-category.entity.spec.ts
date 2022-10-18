import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../../../common/config/database/database.module';
import { RoomCategory } from '../room-category.entity';
import { MemoRoomCategory } from '../type/memo-room-category';
import { getRoomCategory } from './room-category.fixture';

describe('RoomCategory Entity Text', () => {
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
    const roomCategory = new RoomCategory();
    roomCategory.name = MemoRoomCategory.STUDY;
    roomCategory.thumbnail = 'test.png';

    const em = dataSource.createEntityManager();

    // when
    await em.save(roomCategory);

    // then
    expect(roomCategory).toMatchObject({
      id: expect.any(Number),
      name: MemoRoomCategory.STUDY,
      thumbnail: 'test.png',
    });
  });

  test('read', async () => {
    // given
    const roomCategory = getRoomCategory();

    const em = dataSource.createEntityManager();

    // when
    await em.save(roomCategory);

    // then
    const savedRoomCategory = await em.findOneBy(RoomCategory, { id: roomCategory.id });
    expect(savedRoomCategory).toMatchObject({
      id: roomCategory.id,
      name: roomCategory.name,
      thumbnail: roomCategory.thumbnail,
    });
  });
});
