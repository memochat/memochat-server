import { faker } from '@faker-js/faker';
import { MemoRoomCatrgory } from '../type/memo-room-category';
import { MemoRoom } from '../memo-room.entity';

export const getMemoRoom = (data: Partial<MemoRoom> = {}) => {
  const memoRoom = new MemoRoom();
  memoRoom.id = data.id || faker.datatype.number({ min: 1 });
  memoRoom.category = data.category || MemoRoomCatrgory.DEFAULT;
  memoRoom.name = data.name || faker.word.noun();
  memoRoom.isPinned = data.isPinned || false;
  memoRoom.image = data.image || '';
  memoRoom.createdAt = data.createdAt || new Date();
  memoRoom.updatedAt = data.updatedAt || new Date();
  return memoRoom;
};
