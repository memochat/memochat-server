import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  thumbnail: string;
}
