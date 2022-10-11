import { Injectable, HttpStatus, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ResponseEntity } from 'src/common/response/response-entity';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /*
  ## 생성  

  userService에서 비밀번호 확인 및 비밀번호 변경 API 필요
  GET /users/password 비밀번호 확인 API
  PATCH /users/password 비밀번호 변경 API 

  ## 수정
  PATCH users/nickname 닉네임 변경 API
  PATCH users/thumbnail 썸네일 변경 API

  */

  @Get('/me')
  @Auth()
  @ApiOperation({ summary: '유저 정보 조회 API', description: '로그인 된 유저의 정보를 조회합니다.' })
  @ApiSuccessResponse(HttpStatus.OK)
  async gets(@CurrentUser() user: User) {
    return ResponseEntity.OK_WITH_DATA(user);
  }

  async updateNickname(user: User, nickname: string) {
    user.updateNickname(nickname);

    await this.userRepository.save(user);

    return user;
  }
}
