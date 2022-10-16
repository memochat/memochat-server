import { PickType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class PasswordRequestDto extends PickType(User, ['password'] as const) {}
