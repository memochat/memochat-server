import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base-entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Verifications')
@Entity()
export class Verification extends BaseEntity {
  @ApiProperty({
    example: '5K76792.^&Ffil>i@b[gBjX;dr*jbG',
    description: '이메일 인증 시 생성되는 코드입니다.',
    required: true,
  })
  @Column()
  @IsString()
  code: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
