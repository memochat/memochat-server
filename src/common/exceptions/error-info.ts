import { Exclude, Expose } from 'class-transformer';
import { ResponseStatus } from '../response/response-status';

export class ErrorInfo<T> {
  @Exclude()
  private readonly _errorCode: ResponseStatus;

  @Exclude()
  private readonly _message: string;

  @Exclude()
  private readonly _isHidden: boolean;

  @Exclude()
  private readonly _data?: T;

  constructor(errorCode: ResponseStatus, message: string, isHidden = false, data?: T) {
    this._errorCode = errorCode;
    this._message = message;
    this._isHidden = isHidden;
    this._data = data;
  }

  @Expose()
  get errorCode() {
    return this._errorCode;
  }

  @Expose()
  get message() {
    return this._message;
  }

  @Exclude()
  get isHidden() {
    return this._isHidden;
  }

  @Expose()
  get data() {
    return this._data;
  }
}
