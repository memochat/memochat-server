import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../../../common/config/database/database.module';
import { RoomType } from '../room-type.entity';
import { MemoRoomCatrgory } from '../type/memo-room-category';
import { getRoomType } from './room-type.fixture';

describe('RoomType Entity Text', () => {
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
    const roomType = new RoomType();
    roomType.category = MemoRoomCatrgory.STUDY;
    roomType.thumbnail = 'test.png';

    const em = dataSource.createEntityManager();

    // when
    await em.save(roomType);

    // then
    expect(roomType).toMatchObject({
      id: expect.any(Number),
      category: MemoRoomCatrgory.STUDY,
      thumbnail: 'test.png',
    });
  });

  test('read', async () => {
    // given
    const roomType = getRoomType();

    const em = dataSource.createEntityManager();

    // when
    await em.save(roomType);

    // then
    const savedRoomType = await em.findOneBy(RoomType, { id: roomType.id });
    expect(savedRoomType).toMatchObject({
      id: roomType.id,
      category: roomType.category,
      thumbnail: roomType.thumbnail,
    });
  });
});
