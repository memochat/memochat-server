import { Body, Controller, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PathNicknameRequestDto } from './dto/patch-nickname-request.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('/users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/nickname')
  @Auth()
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  async update(@CurrentUser() user: User, @Body() body: PathNicknameRequestDto) {
    await this.userService.updateNickname(user, body.nickname);
  }
}
