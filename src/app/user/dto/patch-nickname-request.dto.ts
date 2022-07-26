import { PickType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class PatchNicknameRequestDto extends PickType(User, ['nickname']) {}
