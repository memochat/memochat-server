import { PickType } from '@nestjs/swagger';
import { Verification } from '../verification.entity';

export class SendEmailRequestDto extends PickType(Verification, ['email'] as const) {}
