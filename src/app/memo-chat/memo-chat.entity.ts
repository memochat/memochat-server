import { BaseEntity } from '../../common/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { MemoRoom } from '../memo-room/memo-room.entity';
import { ChatType } from './type/memo-chat-type';

@Entity({ name: 'memo_chat' })
export class MemoChat extends BaseEntity {
  @ManyToOne(() => User, { lazy: true, nullable: false })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Promise<MemoRoom>;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  type: ChatType;

  @Column({ type: 'varchar', nullable: true })
  link: string | null;

  @Column({ type: 'varchar', nullable: true })
  title: string | null;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string | null;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date | null;
}
