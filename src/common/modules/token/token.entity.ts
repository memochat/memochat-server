import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../../app/user/user.entity';
import { BaseEntity } from '../../base-entity';
import { TokenType } from './type/token-type';
import { TokenTypeTransformer } from './type/token-type.transformer';

@Entity({ name: 'token' })
export class Token extends BaseEntity {
  @Column({ type: 'varchar', length: 600 })
  token: string;

  @Column({ default: false })
  isBlackList: boolean;

  @Column({ type: 'varchar', length: 600, transformer: new TokenTypeTransformer() })
  type: TokenType;

  @ManyToOne(() => User, { lazy: true })
  user: Promise<User>;

  static of(token: string, type: TokenType, user: User) {
    const entity = new Token();
    entity.token = token;
    entity.type = type;
    entity.user = Promise.resolve(user);
    return entity;
  }

  setBlackList() {
    this.isBlackList = true;
  }
}
