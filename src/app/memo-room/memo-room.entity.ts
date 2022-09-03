import { BaseEntity } from '../../common/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { RoomType } from './room-type.entity';

@Entity({ name: 'memo_room' })
export class MemoRoom extends BaseEntity {
  static MAX_ROOM_COUNT = 20;

  @ManyToOne(() => User, { lazy: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<User>;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @ManyToOne(() => RoomType, { eager: true, nullable: false })
  roomType: RoomType;

  setUser(user: User) {
    this.user = Promise.resolve(user);
  }
}
