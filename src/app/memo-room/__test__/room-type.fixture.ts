import { faker } from '@faker-js/faker';
import { RoomType } from '../room-type.entity';
import { MemoRoomCategory } from '../type/memo-room-category';

export const getRoomType = (data: Partial<RoomType> = {}) => {
  const roomType = new RoomType();
  roomType.id = data.id || faker.datatype.number({ min: 1 });
  roomType.category = data.category || MemoRoomCategory.DEFAULT;
  roomType.thumbnail = data.thumbnail || 'test.png';
  return roomType;
};

export const getInitialRoomTypes = () => {
  const categories = MemoRoomCategory.values();
  return categories.map((category, idx) => getRoomType({ id: idx + 1, category }));
};
