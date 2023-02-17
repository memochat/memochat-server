import { BaseEntity } from '../../common/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MemoRoom } from '../memo-room/memo-room.entity';
import { MemoChatCategory } from './type/memo-chat-category';

@Entity({ name: 'memo_chat' })
export class MemoChat extends BaseEntity {
  @ManyToOne(() => MemoRoom, { lazy: true, nullable: false })
  @JoinColumn({ name: 'roomId', referencedColumnName: 'id' })
  memoRoom: Promise<MemoRoom>;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', length: 4000 })
  message: string;

  @Column({ type: 'varchar', length: 20 })
  type: MemoChatCategory;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title?: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  thumbnail?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
