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
import { MailService } from '../mail/mail.service';
import { SendEmailRequestDto } from './dto/send-email.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async signup({ email, password }: SignupRequestDto) {
    if (await this.userRepository.isExistEamil(email)) {
      throw new AlreadyExistEmailException();
    }

    const verification = await this.verifications.findOneBy({ email });
    if (!verification) {
      throw new VerficationNotFoundException();
    }

    if (verification.verified === false) {
      throw new Error('검증되지 않은 이메일입니다.');
    }

    const user = new User();
    user.email = email;
    user.password = await this.hashService.hash(password);
    user.nickname = user.createNickname(email);
    user.verified = true;

    await this.userRepository.save(user);
    await this.verifications.delete(verification.id);

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

  async sendEmail({ email }: SendEmailRequestDto): Promise<boolean> {
    if (await this.userRepository.isExistEamil(email)) {
      throw new AlreadyExistEmailException();
    }

    const existedVerification = await this.verifications.findOneBy({ email });
    if (existedVerification) {
      existedVerification.code = uuidv4();
      await this.verifications.save(existedVerification);
      this.mailService.sendVerificationEmail(email, existedVerification.code);
    } else {
      const verification = await this.verifications.save(this.verifications.create({ email }));
      this.mailService.sendVerificationEmail(email, verification.code);
    }
    return true;
  }

  async verifyEmail({ code }: VerifyEmailRequestDto): Promise<boolean> {
    const verification = await this.verifications.findOneBy({ code });

    if (!verification) {
      // 이미 검증된 Verification에 대해 다시 Verify를 해도 문제가 없긴한데 중복 방지 처리가 필요한지??
      throw new VerficationNotFoundException();
    }

    verification.verified = true;
    await this.verifications.save(verification);

    return true;
  }
}
