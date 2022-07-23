import { anyString, anything, instance, mock, when } from 'ts-mockito';
import { AlreadyExistEmailException } from '../../../common/exceptions/already-exist-email.exception';
import { HashService } from '../hash.service';
import { User } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';
import { AuthService } from '../auth.service';
import { TokenService } from '../../../common/modules/token/token.service';
import { getUser } from '../../user/__test__/user.fixture';
import { UserNotFoundException } from '../../../common/exceptions/user-not-found.exception';
import { NotMatchedPasswordException } from '../../../common/exceptions/not-matched-password.exception';

describe('Auth Service Unit Test', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let hashService: HashService = new HashService();

  describe('signup', () => {
    test('해당하는 이메일로 가입된 유저가 이미 존재하는 경우 AlreadyExistEmailException이 발생하는가', async () => {
      // given
      const email = 'test@test.com';
      const password = 'test';
      const nickname = 'test';
      userRepository = mock(UserRepository);
      when(userRepository.isExistEamil(anyString())).thenResolve(true);
      tokenService = mock(TokenService);
      when(tokenService.generateAuthToken(anything())).thenResolve({
        refreshToken: 'ttestes.testest.setse',
        accessToken: 'testes.testesteagve.aeststsa',
        userId: 1,
      });

      authService = new AuthService(instance(userRepository), hashService, instance(tokenService));

      // when
      const result = authService.signup({ email, password, nickname });

      // then
      await expect(result).rejects.toThrow(AlreadyExistEmailException);
    });

    test('해당하는 이메일로 가입된 유저가 없는 경우 생성된 유저가 리턴되는가', async () => {
      // given
      const email = 'test@test.com';
      const password = 'test';
      const nickname = 'test';
      userRepository = mock(UserRepository);
      when(userRepository.isExistEamil(anyString())).thenResolve(false);
      when(userRepository.save(anything())).thenCall((user: User) => {
        user.id = 1;
        user.createdAt = new Date();
        user.updatedAt = new Date();
        return user;
      });
      tokenService = mock(TokenService);

      authService = new AuthService(instance(userRepository), hashService, instance(tokenService));

      // when
      const result = authService.signup({ email, password, nickname });

      // then
      await expect(result).resolves.toMatchObject({
        id: 1,
        email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      await expect(hashService.compare(password, (await result).password)).resolves.toEqual(true);
    });
  });

  describe('signin', () => {
    test('로그인 성공시 엑세스, 리프레시 토큰을 리턴하는가', async () => {
      // given
      const user = getUser();
      userRepository = mock(UserRepository);
      when(userRepository.findOneBy(anything())).thenResolve(user);
      hashService = mock(HashService);
      when(hashService.compare(anything(), anything())).thenResolve(true);
      tokenService = mock(TokenService);
      when(tokenService.generateAuthToken(anything())).thenCall((user: User) => ({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
        userId: user.id,
      }));

      authService = new AuthService(instance(userRepository), instance(hashService), instance(tokenService));

      // when
      const result = authService.signin({ email: user.email, password: user.password });

      // then
      await expect(result).resolves.toMatchObject({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
        userId: user.id,
      });
    });
    test('해당하는 이메일을 가진 유저가 존재하지 않는 경우 UserNotFoundException이 발생하는가', async () => {
      // given
      const user = getUser();
      userRepository = mock(UserRepository);
      when(userRepository.findOneBy(anything())).thenResolve(null);
      hashService = mock(HashService);
      when(hashService.compare(anything(), anything())).thenResolve(true);
      tokenService = mock(TokenService);
      when(tokenService.generateAuthToken(anything())).thenCall((user: User) => ({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
        userId: user.id,
      }));

      authService = new AuthService(instance(userRepository), instance(hashService), instance(tokenService));

      // when
      const result = authService.signin({ email: user.email, password: user.password });

      // then
      await expect(result).rejects.toThrow(UserNotFoundException);
    });

    test('비밀번호가 일치하지 않는 경우, NotMatchedPasswordException이 발생하는가', async () => {
      // given
      const user = getUser();
      userRepository = mock(UserRepository);
      when(userRepository.findOneBy(anything())).thenResolve(user);
      hashService = mock(HashService);
      when(hashService.compare(anything(), anything())).thenResolve(false);
      tokenService = mock(TokenService);
      when(tokenService.generateAuthToken(anything())).thenCall((user: User) => ({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
        userId: user.id,
      }));

      authService = new AuthService(instance(userRepository), instance(hashService), instance(tokenService));

      // when
      const result = authService.signin({ email: user.email, password: user.password });

      // then
      await expect(result).rejects.toThrow(NotMatchedPasswordException);
    });
  });
});
