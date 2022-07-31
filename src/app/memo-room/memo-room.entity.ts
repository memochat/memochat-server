import { BaseEntity } from '../../common/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MemoRoomCatrgory } from './type/memo-room-category';
import { MemoRoomCategoryTransformer } from './type/memo-room-category.transformer';
import { User } from '../user/user.entity';

@Entity({ name: 'memo_room' })
export class MemoRoom extends BaseEntity {
  @ManyToOne(() => User, { lazy: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<User>;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ type: 'varchar', default: 'DEFAULT', transformer: new MemoRoomCategoryTransformer() })
  category: MemoRoomCatrgory;

  @Column({ type: 'varchar', default: '' })
  image: string;

  setUser(user: User) {
    this.user = Promise.resolve(user);
  }
}
