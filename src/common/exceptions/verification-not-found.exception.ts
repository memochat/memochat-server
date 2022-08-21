import { BadRequestException } from '@nestjs/common';
import { ResponseStatus } from '../response/response-status';
import { ErrorInfo } from './error-info';

export class VerficationNotFoundException extends BadRequestException {
  constructor(message = '해당하는 인증 코드가 존재하지 않습니다.') {
    super(new ErrorInfo(ResponseStatus.VERIFICATION_NOT_FOUND, message));
  }
}
