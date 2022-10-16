import { Injectable } from '@nestjs/common';
import { NotMatchedPasswordException } from 'src/common/exceptions/not-matched-password.exception';
import { HashService } from '../auth/hash.service';
import { PasswordRequestDto } from './dto/password-request.dto';
import { PatchNicknameRequestDto } from './dto/patch-nickname-request.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly hashService: HashService, private readonly userRepository: UserRepository) {}

  async updateNickname(user: User, { nickname }: PatchNicknameRequestDto) {
    user.updateNickname(nickname);

    await this.userRepository.save(user);

    return user;
  }

  async checkPassword(user: User, { password }: PasswordRequestDto) {
    const existedUser = await this.userRepository.findOne({ where: { id: user.id }, select: ['id', 'email', 'password'] });

    const passwordCorrect = await this.hashService.compare(password, existedUser.password);
    if (!passwordCorrect) {
      throw new NotMatchedPasswordException();
    }
    return true;
  }

  async changePassword(user: User, { password: newPassword }: PasswordRequestDto) {
    const existedUser = await this.userRepository.findOne({ where: { id: user.id }, select: ['id', 'email', 'password'] });

    existedUser.password = await this.hashService.hash(newPassword);
    await this.userRepository.save(existedUser);

    return true;
  }
}
