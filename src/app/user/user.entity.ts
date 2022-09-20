import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({ example: 'test-user@test.com', description: '로그인 시 유저가 생성한 ID 입니다.', required: true })
  @Column()
  @IsEmail()
  @Transform((params) => params.value.trim())
  @MaxLength(25)
  email: string;

  @ApiProperty({ example: 'test123', description: 'password', required: true })
  @Column()
  @Matches(/^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/, {
    message: '비밀번호는 문자, 숫자, 특수문자가 최소 1개 이상 포함되며 8자리에서 최대 16자리 문자열입니다.',
  })
  @IsString()
  @Transform((params) => params.value.trim())
  @MinLength(8)
  @MaxLength(16)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'nickname', description: 'App 내에서 사용하는 nickname 입니다.' })
  @Column()
  @IsString()
  @Transform((params) => params.value.trim())
  @MinLength(2)
  @MaxLength(10)
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ example: 'thumbnail s3 url', description: 'User Profile Image' })
  @Column({ default: '기본 프로필 url' })
  @IsString()
  @Transform((params) => params.value.trim())
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({ example: 'boolean', description: '이메일 인증 여부입니다.', required: true })
  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

  createNickname(nickname: string): string {
    return nickname.split('@').at(0).slice(0, 10);
  }

  updateNickname(nickname: string) {
    this.nickname = nickname;
  }
}
