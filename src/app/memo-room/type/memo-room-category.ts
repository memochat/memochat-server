import { Enum, EnumType } from 'ts-jenum';

@Enum('_name')
export class MemoRoomCategory extends EnumType<MemoRoomCategory>() {
  static readonly DEFAULT = new MemoRoomCategory('DEFAULT');

  static readonly WISHLIST = new MemoRoomCategory('WISHLIST');

  static readonly CALENDER = new MemoRoomCategory('CALENDER');

  static readonly BUDGET = new MemoRoomCategory('BUDGET');

  static readonly STUDY = new MemoRoomCategory('STUDY');

  constructor(private readonly _name: string) {
    super();
  }

  get name(): string {
    return this._name;
  }

  equals(v: MemoRoomCategory): boolean {
    return this.name === v.name;
  }
}
