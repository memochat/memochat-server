import { Injectable } from '@nestjs/common';
import { AlreadyExistEmailException } from '../../common/exceptions/already-exist-email.exception';
import { HashService } from './hash.service';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { NotMatchedPasswordException } from '../../common/exceptions/not-matched-password.exception';
import { TokenService } from '../../common/modules/token/token.service';
import { SignupRequestDto } from './dto/signup-request.dto';
import { SigninRequestDto } from './dto/signin-request.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Verification } from './verification.entity';
import { Repository } from 'typeorm';
import { VerficationNotFoundException } from '../../common/exceptions/verification-not-found.exception';
import { MailService } from '../mail/mail.service';
import { EmailRequestDto } from './dto/email-request.dto';
import { v4 as uuidv4 } from 'uuid';
import { EmailNotVerifiedException } from '../../common/exceptions/email-not-verified.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
    private readonly userRepository: UserRepository,
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
      throw new EmailNotVerifiedException();
    }

    const user = new User();
    user.email = email;
    user.password = await this.hashService.hash(password);
    user.nickname = user.createNickname(email);
    user.verified = true;
    user.thumbnail = user.createThumbnail();
    await this.userRepository.save(user);
    await this.verifications.delete(verification.id);

    return user;
  }

  async signin({ email, password }: SigninRequestDto) {
    const user = await this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'password'] });
    console.log(user);

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

  async sendEmail({ email }: EmailRequestDto): Promise<boolean> {
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

  async checkVerification(email: string): Promise<boolean> {
    if (await this.userRepository.isExistEamil(email)) {
      throw new AlreadyExistEmailException();
    }

    const existedVerification = await this.verifications.findOneBy({ email });
    if (existedVerification?.verified === true) {
      return true;
    } else {
      throw new EmailNotVerifiedException();
    }
  }

  async verifyEmail({ code }: VerifyEmailDto) {
    const verification = await this.verifications.findOneBy({ code });

    if (!verification) {
      throw new VerficationNotFoundException();
    }

    verification.verified = true;
    await this.verifications.save(verification);

    return true;
  }
}
