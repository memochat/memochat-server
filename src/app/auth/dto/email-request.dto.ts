import { PickType } from '@nestjs/swagger';
import { Verification } from '../verification.entity';

export class EmailRequestDto extends PickType(Verification, ['email'] as const) {}
