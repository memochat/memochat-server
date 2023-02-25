import { BaseEntity } from '../../common/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { RoomCategory } from './room-category.entity';

@Entity({ name: 'memo_room' })
export class MemoRoom extends BaseEntity {
  static MAX_ROOM_COUNT = 20;

  @ManyToOne(() => User, { lazy: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<User>;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', length: 400, default: null, nullable: true })
  message?: string;

  @ManyToOne(() => RoomCategory, { eager: true, nullable: false })
  @JoinColumn({ name: 'room_category_id', referencedColumnName: 'id' })
  roomCategory: RoomCategory;

  @Column({ type: 'timestamp', nullable: true })
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

  remove() {
    this.deletedAt = new Date();
    this.message = null;
    this.previousRoom = null;
    this.previousRoomId = null;
    this.nextRoom = null;
    this.nextRoomId = null;
  }
}
