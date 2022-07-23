import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiErrorResponse } from './api-error-response.decorator';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth('bearerAuth'), ApiErrorResponse(InvalidTokenException));
}
