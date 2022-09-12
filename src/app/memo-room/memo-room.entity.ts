import { BaseEntity } from '../../common/base-entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
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

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(() => MemoRoom, (memoRoom) => memoRoom.id, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'prev_room_id' })
  previousRoom: MemoRoom | null;

  @Column({ name: 'prev_room_id', nullable: true })
  previousRoomId: number | null;

  @OneToOne(() => MemoRoom, (memoRoom) => memoRoom.id, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'next_room_id' })
  nextRoom: MemoRoom | null;

  @Column({ name: 'next_room_id', nullable: true })
  nextRoomId: number | null;

  setUser(user: User) {
    this.user = Promise.resolve(user);
  }
}
