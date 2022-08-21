import { PickType } from '@nestjs/swagger';
import { Verification } from '../verification.entity';

export class VerifyEmailRequestDto extends PickType(Verification, ['code'] as const) {}
