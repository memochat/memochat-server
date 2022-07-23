import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../../app/user/user.entity';
import { JwtConfigService } from '../../config/jwt/config.service';
import { TokenPayload } from '../token/type/token-payload';
import { TokenType } from '../token/type/token-type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    jwtConfigService: JwtConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.secret,
    });
  }

  async validate(payload: TokenPayload) {
    try {
      const tokenType = TokenType.valueOf(payload.type);

      if (!tokenType.equals(TokenType.ACCESS)) {
        throw new Error('Invalid Token Type');
      }

      if (!payload.sub) {
        throw new Error('Invalid sub');
      }

      const user = this.userRepository.findOneBy({ id: payload.sub });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (e) {
      throw new Error(`Invalid Token: ${e.message}`);
    }
  }
}
