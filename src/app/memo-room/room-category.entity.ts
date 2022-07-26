import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MemoRoomCategory } from './type/memo-room-category';
import { MemoRoomCategoryTransformer } from './type/memo-room-category.transformer';

@Entity()
export class RoomCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, default: 'DEFAULT', transformer: new MemoRoomCategoryTransformer(), unique: true })
  name: MemoRoomCategory;

  @Column({ type: 'varchar', length: 500, default: '' })
  thumbnail: string;
}
