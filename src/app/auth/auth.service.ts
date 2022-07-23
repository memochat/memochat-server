import { Injectable } from '@nestjs/common';
import { AlreadyExistEmailException } from '../../common/exceptions/already-exist-email.exception';
import { HashService } from './hash.service';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { NotMatchedPasswordException } from '../../common/exceptions/not-matched-password.exception';
import { TokenService } from '../../common/modules/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async signup({ email, password, nickname }: { email: string; password: string; nickname: string }) {
    if (await this.userRepository.isExistEamil(email)) {
      throw new AlreadyExistEmailException();
    }

    const user = new User();
    user.email = email;
    user.password = await this.hashService.hash(password);
    user.nickname = nickname;

    await this.userRepository.save(user);

    return user;
  }

  async signin({ email, password }: { email: string; password: string }) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!(await this.hashService.compare(password, user.password))) {
      throw new NotMatchedPasswordException();
    }

    const tokens = await this.tokenService.generateAuthToken(user);

    return tokens;
  }

  async refreshAuthToken(refreshToken: string) {
    const foundRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);

    const tokens = await this.tokenService.generateAuthToken(await foundRefreshToken.user);

    await this.tokenService.delete(foundRefreshToken);
    return tokens;
  }
}
