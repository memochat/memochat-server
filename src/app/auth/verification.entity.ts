import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { BaseEntity } from '../../common/base-entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Verifications')
@Entity()
export class Verification extends BaseEntity {
  @ApiProperty({
    example: '75cb3774-4ddd-4f2e-983a-e05347b7606e',
    description: '이메일 인증 시 생성되는 코드입니다.',
    required: true,
  })
  @Column()
  code: string;

  @ApiProperty({
    example: 'memochat.jesy@gmail.com',
    description: '이메일을 보낼 대상입니다.',
    required: true,
  })
  @Column()
  @IsString()
  email: string;

  @Column({ default: false })
  verified: boolean;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
