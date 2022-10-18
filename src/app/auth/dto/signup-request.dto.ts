import { PickType } from '@nestjs/swagger';
import { User } from '../../../app/user/user.entity';

export class SignupRequestDto extends PickType(User, ['email', 'password'] as const) {}
