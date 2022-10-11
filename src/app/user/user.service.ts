import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /*
  ## 생성  

  userService에서 비밀번호 확인 및 비밀번호 변경 API 필요
  GET /users/auth/password 비밀번호 확인 API
  PATCH /users/auth/password 비밀번호 변경 API 

  ## 수정
  PATCH users/nickname 닉네임 변경 API
  PATCH users/thumbnail 썸네일 변경 API

  */

  async updateNickname(user: User, nickname: string) {
    user.updateNickname(nickname);

    await this.userRepository.save(user);

    return user;
  }
}
