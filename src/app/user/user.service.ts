import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateNickname(user: User, nickname: string) {
    user.updateNickname(nickname);

    await this.userRepository.save(user);

    return user;
  }
}
