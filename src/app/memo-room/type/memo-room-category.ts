import { Enum, EnumType } from 'ts-jenum';

@Enum('_name')
export class MemoRoomCatrgory extends EnumType<MemoRoomCatrgory>() {
  static readonly DEFAULT = new MemoRoomCatrgory('DEFAULT');

  static readonly WISHLIST = new MemoRoomCatrgory('WISHLIST');

  static readonly CALENDER = new MemoRoomCatrgory('CALENDER');

  static readonly BUDGET = new MemoRoomCatrgory('BUDGET');

  static readonly STUDY = new MemoRoomCatrgory('STUDY');

  constructor(private readonly _name: string) {
    super();
  }

  get name(): string {
    return this._name;
  }

  equals(v: MemoRoomCatrgory): boolean {
    return this.name === v.name;
  }
}
