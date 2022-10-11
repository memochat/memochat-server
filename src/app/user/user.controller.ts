import { Body, Controller, HttpStatus, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from 'src/common/response/response-entity';
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

  @Get('/me')
  @Auth()
  @ApiOperation({ summary: '유저 정보 조회 API', description: '로그인 된 유저의 정보를 조회합니다.' })
  @ApiSuccessResponse(HttpStatus.OK)
  async gets(@CurrentUser() user: User) {
    return ResponseEntity.OK_WITH_DATA(user);
  }

  @Patch('/nickname')
  @Auth()
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  async update(@CurrentUser() user: User, @Body() body: PathNicknameRequestDto) {
    await this.userService.updateNickname(user, body.nickname);
  }
}
