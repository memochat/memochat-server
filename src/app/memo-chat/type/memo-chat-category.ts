import { Enum, EnumType } from 'ts-jenum';

@Enum('_name')
export class MemoChatCategory extends EnumType<MemoChatCategory>() {
  static readonly TEXT = new MemoChatCategory('TEXT');

  static readonly LINK = new MemoChatCategory('LINK');

  static readonly PHOTO = new MemoChatCategory('PHOTO');

  static readonly PHOTOS = new MemoChatCategory('PHOTOS');

  constructor(private readonly _name: string) {
    super();
  }

  get name(): string {
    return this._name;
  }

  equals(v: MemoChatCategory): boolean {
    return this.name === v + '';
  }
}
