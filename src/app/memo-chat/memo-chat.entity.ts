import { BaseEntity } from '../../common/base-entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne } from 'typeorm';
import { MemoRoom } from '../memo-room/memo-room.entity';
import { MemoChatCategory } from './type/memo-chat-category';
import { MemoChatCategoryTransformer } from './type/memo-chat-category.transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

@Entity({ name: 'memo_chat' })
export class MemoChat extends BaseEntity {
  @OneToOne(() => MemoRoom, (memoRoom) => memoRoom.id, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'room_id' })
  memoRoom: MemoRoom | null;

  @ApiProperty({ example: '1', description: '메모챗이 속하는 MemoRoom Id입니다.', required: true })
  @IsNumber()
  @Column({ name: 'room_id' })
  memoRoomId: number;

  @ApiProperty({
    example: 'memochat',
    description: '사용자가 보내는 text 입니다. text 안에는 link도 포함되어 있습니다.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 4000 })
  message: string;

  @ApiProperty({
    example: 'TEXT | LINK | PHOTO',
    description: '사용자가 텍스트 유형입니다. TEXT : link가 없는 일반 텍스트 \t LINK : link가 포함된 텍스트 \t PHOTO : 사진',
    required: true,
  })
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 20, transformer: new MemoChatCategoryTransformer() })
  type: MemoChatCategory;

  @ApiProperty({
    example: '옵시디언 사용해 보실래요? - 동기화, 백업 환경 구축',
    description: 'link의 메타데이터 중 title 입니다.',
  })
  @IsString()
  @Column({ type: 'varchar', length: 200, nullable: true })
  title?: string | null;

  @ApiProperty({
    example: '최고의 메모 어플 옵시디언, 동기화와 안정성 두마리의 토끼를 모두 잡아 구축한 이야기를 공유해봅니다 🎉',
    description: 'link의 메타데이터 중 description 입니다.',
    required: true,
  })
  @IsString()
  @Column({ type: 'varchar', length: 200, nullable: true })
  description?: string | null;

  @ApiProperty({
    example: 'https://velog.velcdn.com/images/joshuara7235/post/240c43f5-b604-4853-8e88-820d3a3f53ea/image.png',
    description: 'link의 메타데이터 중 description 입니다.',
    required: true,
  })
  @IsString()
  @Column({ type: 'varchar', length: 200, nullable: true })
  thumbnail?: string | null;

  @ApiProperty({
    example: '삭제된 날짜',
    description: '삭제된 메모일 경우 삭제 날짜가 기입됩니다.',
  })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
