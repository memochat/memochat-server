import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { NotMatchedPasswordException } from '../../common/exceptions/not-matched-password.exception';
import { HashService } from '../auth/hash.service';
import { PasswordRequestDto } from './dto/password-request.dto';
import { PatchNicknameRequestDto } from './dto/patch-nickname-request.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import fetch from 'node-fetch';
import metascraper from 'metascraper';
import metaTitle from 'metascraper-title';
import metaDescription from 'metascraper-description';
import metaImage from 'metascraper-image';

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

  async deleteUser(user: User) {
    const existedUser = await this.userRepository.findOneBy({ id: user.id });
    if (!existedUser) {
      throw new UserNotFoundException();
    }

    // await this.userRepository.softDelete()
  }

  async createMemochat(user: User, url: string): Promise<boolean> {
    const createMeta = metascraper([metaTitle(), metaDescription(), metaImage()]);
    const html = await fetch(url.toString(), {
      method: 'GET',
    }).then((res) => res.text());

    /*
     같은 url에 대해 캐싱 처리?
     */

    const { title, description, image } = await createMeta({ html, url });
    console.log(`title: ${title} \n description: ${description} \n image: ${image}`);

    return true;
  }
}
