import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import moment, { Moment } from 'moment';
import { Equal, Repository } from 'typeorm';
import { User } from '../../../app/user/user.entity';
import { JwtConfigService } from '../../config/jwt/config.service';
import { InvalidTokenException } from '../../exceptions/invalid-token.exception';
import { Token } from './token.entity';
import { TokenPayload } from './type/token-payload';
import { TokenType } from './type/token-type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  private generateToken(sub: number, exp: Moment, type: TokenType) {
    const payload: TokenPayload = {
      sub,
      iat: moment().unix(),
      exp: exp.unix(),
      type: type.code,
    };
    return this.jwtService.sign(payload);
  }

  async generateAuthToken(user: User) {
    const accessTokenExpires = moment().add(this.jwtConfigService.accessTokenExpireMinutes, 'minutes');
    const accessToken = this.generateToken(user.id, accessTokenExpires, TokenType.ACCESS);

    const refreshTokenExpires = moment().add(this.jwtConfigService.refreshTokenExpireDays, 'days');
    const refreshToken = this.generateToken(user.id, refreshTokenExpires, TokenType.REFRESH);

    const token = Token.of(refreshToken, TokenType.REFRESH, user);
    await this.tokenRepository.save(token);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const convertedPaylaod = plainToInstance(TokenPayload, payload);

      if (!TokenType.REFRESH.equals(convertedPaylaod.type)) {
        throw new Error('Invalid Token Type');
      }

      const foundToken = await this.tokenRepository.findOneBy({
        token,
        user: { id: convertedPaylaod.sub },
        type: Equal(TokenType.REFRESH),
      });

      if (!foundToken) {
        throw new Error('Token Not Found');
      }

      if (foundToken.isBlackList) {
        throw new Error('This Token is BlackList');
      }

      return foundToken;
    } catch (e) {
      throw new InvalidTokenException();
    }
  }

  async delete(token: Token) {
    await this.tokenRepository.delete({ id: token.id, token: token.token });
  }
}
