import { Enum, EnumType } from 'ts-jenum';

@Enum('_name')
export class UserThumbnail extends EnumType<UserThumbnail>() {
  static readonly PURPLE = new UserThumbnail('PURPLE');

  static readonly DARKPURPLE = new UserThumbnail('DARKPURPLE');

  static readonly GREEN = new UserThumbnail('GREEN');

  static readonly YELLOW = new UserThumbnail('YELLOW');

  constructor(private readonly _name: string) {
    super();
  }

  get name(): string {
    return this._name;
  }

  equals(v: UserThumbnail): boolean {
    return this.name === v.name;
  }
}

export const ThumbnailColor = ['PURPLE', 'DARKPURPLE', 'GREEN', 'YELLOW'];
