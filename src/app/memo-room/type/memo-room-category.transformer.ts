import { MemoRoomCategory } from './memo-room-category';
import { ValueTransformer } from 'typeorm';

export class MemoRoomCategoryTransformer implements ValueTransformer {
  to(entityValue: MemoRoomCategory): string {
    if (!(entityValue instanceof MemoRoomCategory)) return null;

    return entityValue.name;
  }

  from(databaseValue: string): MemoRoomCategory {
    return MemoRoomCategory.find(databaseValue);
  }
}
