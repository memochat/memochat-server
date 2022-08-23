import { Enum, EnumType } from 'ts-jenum';

@Enum('_code')
export class ImageType extends EnumType<ImageType>() {
  static readonly USER_PROFILE = new ImageType('USER_PROFILE', '유저프로필');

  static readonly CHAT = new ImageType('CHAT', '채팅');

  constructor(private readonly _code: string, private readonly _name: string) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  equals(code: string): boolean;
  equals(v: ImageType): boolean;
  equals(v: string | ImageType) {
    let isEquals = false;

    if (v instanceof ImageType) {
      isEquals = this.code === v.code;
    } else if (typeof v === 'string') {
      isEquals = this.code === v;
    }
    return isEquals;
  }
}
