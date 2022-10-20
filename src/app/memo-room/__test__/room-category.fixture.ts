import { faker } from '@faker-js/faker';
import { RoomCategory } from '../room-category.entity';
import { MemoRoomCategory } from '../type/memo-room-category';

export const getRoomCategory = (data: Partial<RoomCategory> = {}) => {
  const roomCategory = new RoomCategory();
  roomCategory.id = data.id || faker.datatype.number({ min: 1 });
  roomCategory.name = data.name || MemoRoomCategory.DEFAULT;
  roomCategory.thumbnail = data.thumbnail || 'test.png';
  return roomCategory;
};

export const getInitialRoomCategories = () => {
  const categories = MemoRoomCategory.values();
  return categories.map((category, idx) => getRoomCategory({ id: idx + 1, name: category }));
};
