import { Injectable } from '@nestjs/common';
import { AlreadyExistEmailException } from '../../common/exceptions/already-exist-email.exception';
import { HashService } from './hash.service';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { NotMatchedPasswordException } from '../../common/exceptions/not-matched-password.exception';
import { TokenService } from '../../common/modules/token/token.service';
import { SignupRequestDto } from './dto/signup-request.dto';
import { VerifyEmailRequestDto } from './dto/verify-email-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Verification } from './verification.entity';
import { Repository } from 'typeorm';
import { VerficationNotFoundException } from 'src/common/exceptions/verification-not-found.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Verification) private readonly verfications: Repository<Verification>,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async signup({ email, password }: SignupRequestDto) {
    if (await this.userRepository.isExistEamil(email)) {
      throw new AlreadyExistEmailException();
    }

    const user = new User();
    user.email = email;
    user.password = await this.hashService.hash(password);
    user.nickname = user.createNickname(email);

    await this.userRepository.save(user);
    await this.verfications.save(this.verfications.create({ user }));

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

  async verifyEmail({ code }: VerifyEmailRequestDto): Promise<boolean> {
    const verification = await this.verfications.findOne({
      where: {
        code,
      },
      relations: {
        user: true,
      },
    });

    if (!verification) {
      throw new VerficationNotFoundException();
    }

    verification.user.verified = true;
    await this.userRepository.save(verification.user);
    return true;
  }
}
