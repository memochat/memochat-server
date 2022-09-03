import { faker } from '@faker-js/faker';
import { RoomType } from '../room-type.entity';
import { MemoRoomCatrgory } from '../type/memo-room-category';

export const getRoomType = (data: Partial<RoomType> = {}) => {
  const roomType = new RoomType();
  roomType.id = data.id || faker.datatype.number({ min: 1 });
  roomType.category = data.category || MemoRoomCatrgory.DEFAULT;
  roomType.thumbnail = data.thumbnail || 'test.png';
  return roomType;
};
