import { Test } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { DatabaseModule } from '../../../config/database/database.module';
import { Token } from '../token.entity';
import { TokenType } from '../type/token-type';

describe('Token Entity Test', () => {
  let dataSource: DataSource;
  let tokenRepository: Repository<Token>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    dataSource = module.get(DataSource);
    tokenRepository = dataSource.getRepository(Token);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  test('토큰 엔티티가 잘 저장되는가', async () => {
    // given
    const token = new Token();
    token.token = 'test';
    token.type = TokenType.REFRESH;

    // when
    await tokenRepository.save(token);

    // then
  });

  test('저장된 토큰 엔티티 정보를 잘 조회하는가 (transformer의 정상동작 체크)', async () => {
    // given
    const token = new Token();
    token.token = 'test';
    token.type = TokenType.REFRESH;
    token.isBlackList = true;

    await tokenRepository.save(token);

    // when
    const savedToken = await tokenRepository.findOneBy({ id: token.id });

    // then
    expect(savedToken).toMatchObject({
      id: expect.any(Number),
      token: 'test',
      type: TokenType.REFRESH,
      isBlackList: true,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
