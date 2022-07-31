import { MemoRoomCatrgory } from './memo-room-category';
import { ValueTransformer } from 'typeorm';

export class MemoRoomCategoryTransformer implements ValueTransformer {
  to(entityValue: MemoRoomCatrgory): string {
    if (!(entityValue instanceof MemoRoomCatrgory)) return null;

    return entityValue.name;
  }

  from(databaseValue: string): MemoRoomCatrgory {
    return MemoRoomCatrgory.find(databaseValue);
  }
}
