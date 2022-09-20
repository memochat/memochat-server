import { PickType } from '@nestjs/swagger';
import { User } from 'src/app/user/user.entity';

export class SigninRequestDto extends PickType(User, ['email', 'password'] as const) {}
