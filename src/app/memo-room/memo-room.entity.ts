import { BaseEntity } from '../../common/base-entity';
import { Column, Entity } from 'typeorm';
import { MemoRoomCatrgory } from './type/memo-room-category';
import { MemoRoomCategoryTransformer } from './type/memo-room-category.transformer';

@Entity({ name: 'memo_room' })
export class MemoRoom extends BaseEntity {
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ type: 'varchar', default: 'DEFAULT', transformer: new MemoRoomCategoryTransformer() })
  category: MemoRoomCatrgory;

  @Column({ type: 'varchar', default: '' })
  image: string;
}
