import { faker } from '@faker-js/faker';
import { MemoRoom } from '../memo-room.entity';
import { getUser } from '../../user/__test__/user.fixture';
import { getRoomCategory } from './room-category.fixture';

export const getMemoRoom = (data: Partial<MemoRoom> = {}) => {
  const memoRoom = new MemoRoom();
  memoRoom.id = data.id || faker.datatype.number({ min: 1 });
  memoRoom.user = data.user || Promise.resolve(getUser());
  memoRoom.name = data.name || faker.word.noun();
  memoRoom.roomCategory = data.roomCategory || getRoomCategory();
  memoRoom.createdAt = data.createdAt || new Date();
  memoRoom.updatedAt = data.updatedAt || new Date();
  return memoRoom;
};
