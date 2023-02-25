import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @ApiProperty({
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2023-02-25T07:14:32.460Z2023-02-25T07:14:32.460Z2',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2023-02-25T07:14:32.460Z2023-02-25T07:14:32.460Z2',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
