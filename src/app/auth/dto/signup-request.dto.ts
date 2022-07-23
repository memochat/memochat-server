import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignupRequestDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '!a123456' })
  @Matches(/^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/, {
    message: '비밀번호는 문자, 숫자, 특수문자가 최소 1개 이상 포함되며 8자리에서 최대 16자리 문자열입니다.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'nickname' })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
