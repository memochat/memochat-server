import { Body, Controller, HttpStatus, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { NotMatchedPasswordException } from 'src/common/exceptions/not-matched-password.exception';
import { ResponseEntity } from 'src/common/response/response-entity';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PasswordRequestDto } from './dto/password-request.dto';
import { PatchNicknameRequestDto } from './dto/patch-nickname-request.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('/users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @Auth()
  @ApiOperation({ summary: '유저 정보 조회 API', description: '로그인 된 유저의 정보를 조회합니다.' })
  @ApiSuccessResponse(HttpStatus.OK, User)
  async me(@CurrentUser() user: User) {
    return ResponseEntity.OK_WITH_DATA(user);
  }

  @Patch('/nickname')
  @Auth()
  @ApiOperation({ summary: '유저 닉네임 변경 API', description: '유저의 닉네임을 변경합니다.' })
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  async update(@CurrentUser() user: User, @Body() patchNicknameRequestDto: PatchNicknameRequestDto) {
    await this.userService.updateNickname(user, patchNicknameRequestDto);
    return ResponseEntity.OK();
  }

  @Get('/password')
  @Auth()
  @ApiOperation({ summary: '유저 비밀번호 확인 API', description: '입력한 비밀번호와 유저의 현재 비밀번호를 확인합니다.' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(NotMatchedPasswordException)
  async checkPassword(@CurrentUser() user: User, @Body() passwordRequestDto: PasswordRequestDto) {
    await this.userService.checkPassword(user, passwordRequestDto);
    return ResponseEntity.OK();
  }

  @Patch('/password')
  @Auth()
  @ApiOperation({ summary: '유저 비밀번호 변경 API', description: '유저의 비밀번호를 변경합니다.' })
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  @ApiErrorResponse(NotMatchedPasswordException)
  async changePassword(@CurrentUser() user: User, @Body() passwordRequestDto: PasswordRequestDto) {
    await this.userService.changePassword(user, passwordRequestDto);
    return ResponseEntity.OK();
  }
}
