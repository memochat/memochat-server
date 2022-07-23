import { ValueTransformer } from 'typeorm';
import { TokenType } from './token-type';

export class TokenTypeTransformer implements ValueTransformer {
  to(value: TokenType) {
    if (!value) {
      return;
    }

    return value.enumName;
  }
  from(value: string) {
    if (!value) {
      return;
    }

    return TokenType.valueByName(value);
  }
}
