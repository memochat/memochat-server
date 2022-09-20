import jwt from 'jsonwebtoken';
import moment from 'moment';
import { TokenPayload } from '../../src/common/modules/token/type/token-payload';
import { User } from '../../src/app/user/user.entity';
import { TokenType } from '../../src/common/modules/token/type/token-type';

export class AccessToken {
  private _token: string;

  private constructor(user: User) {
    const payload: TokenPayload = {
      sub: user.id,
      exp: moment().add(1, 'd').unix(),
      iat: moment().unix(),
      type: TokenType.ACCESS.code,
    };

    this._token = jwt.sign(payload, process.env.JWT_SECRET);
  }

  static of(user: User) {
    const token = new AccessToken(user);
    return token;
  }

  get bearerForm() {
    return `bearer ${this._token}`;
  }
}
