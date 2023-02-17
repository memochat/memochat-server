import { PickType } from '@nestjs/swagger';
import { Verification } from '../verification.entity';

export class VerifyEmailDto extends PickType(Verification, ['code'] as const) {}
