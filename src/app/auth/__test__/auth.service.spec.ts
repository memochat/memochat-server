import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../../../common/config/database/database.module';
import { AlreadyExistEmailException } from '../../../common/exceptions/already-exist-email.exception';
import { NotMatchedPasswordException } from '../../../common/exceptions/not-matched-password.exception';
import { UserNotFoundException } from '../../../common/exceptions/user-not-found.exception';
import { TokenModule } from '../../../common/modules/token/token.module';
import { UserModule } from '../../user/user.module';
import { UserRepository } from '../../user/user.repository';
import { getUser } from '../../user/__test__/user.fixture';
import { AuthService } from '../auth.service';
import { HashService } from '../hash.service';

describe('Auth Service Test', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let dataSource: DataSource;
  let hashService: HashService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule, UserModule, TokenModule],
      providers: [AuthService, HashService],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
    dataSource = module.get(DataSource);
    hashService = module.get(HashService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  describe('signup', () => {
    test('유저 정보가 정상적으로 생성되는가', async () => {
      // given
      const email = 'test@test.com';
      const password = 'test';
      const nickname = 'test';

      // when
      const result = authService.signup({ email, password, nickname });

      // then
      await expect(result).resolves.toMatchObject({
        id: expect.any(Number),
        email: 'test@test.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      await expect(hashService.compare(password, (await result).password)).resolves.toEqual(true);
    });
    test('이메일이 존재하는 경우 AlreadyExistEmailException이 발생하는가', async () => {
      // given
      const user = getUser();
      await userRepository.save(user);

      // when
      const result = authService.signup({ email: user.email, password: 'test', nickname: 'test' });

      // then
      await expect(result).rejects.toThrow(AlreadyExistEmailException);
    });
  });

  describe('signin', () => {
    test('로그인 성공시, 엑세스 토큰과 리프레시 토큰을 리턴하는가', async () => {
      // given
      const user = getUser();
      const password = user.password;
      user.password = await hashService.hash(user.password);
      await userRepository.save(user);

      // when
      const result = authService.signin({ email: user.email, password });

      // then
      await expect(result).resolves.toMatchObject({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
        userId: user.id,
      });
    });

    test('해당하는 이메일을 가진 유저가 존재하지 않는 경우, UserNotFoundException이 발생하는가', async () => {
      // given
      const email = 'test@test.com';
      const password = 'test';

      // when
      const result = authService.signin({ email, password });

      // then
      await expect(result).rejects.toThrow(UserNotFoundException);
    });

    test('비밃번호가 일치하지 않는 경우, NotMatchedPasswordException이 발생하는가', async () => {
      // given
      const user = getUser();
      const password = user.password;
      user.password = await hashService.hash(user.password + '123');
      await userRepository.save(user);

      // when
      const result = authService.signin({ email: user.email, password });

      // then
      await expect(result).rejects.toThrow(NotMatchedPasswordException);
    });
  });
});
