import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AlreadyExistEmailException } from '../../common/exceptions/already-exist-email.exception';
import { InvalidTokenException } from '../../common/exceptions/invalid-token.exception';
import { NotMatchedPasswordException } from '../../common/exceptions/not-matched-password.exception';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { ResponseEntity } from '../../common/response/response-entity';
import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth-token.dto';
import { RefreshTokensRequestDto } from './dto/refresh-tokens-request.dto';
import { SigninRequestDto } from './dto/signin-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiSuccessResponse(HttpStatus.CREATED)
  @ApiErrorResponse(AlreadyExistEmailException)
  async signup(@Body() signupRequest: SignupRequestDto) {
    await this.authService.signup(signupRequest);

    return ResponseEntity.OK();
  }

  @Post('/signin')
  @ApiSuccessResponse(HttpStatus.OK, AuthTokenDto)
  @ApiErrorResponse(UserNotFoundException, NotMatchedPasswordException)
  async signin(@Body() signinRequest: SigninRequestDto) {
    const tokens = await this.authService.signin(signinRequest);

    return ResponseEntity.OK_WITH_DATA(AuthTokenDto.of(tokens));
  }

  @Post('/refresh-tokens')
  @ApiSuccessResponse(HttpStatus.OK, AuthTokenDto)
  @ApiErrorResponse(InvalidTokenException)
  async refreshAuthToken(@Body() refreshTokensRequest: RefreshTokensRequestDto) {
    const tokens = await this.authService.refreshAuthToken(refreshTokensRequest.refreshToken);

    return ResponseEntity.OK_WITH_DATA(AuthTokenDto.of(tokens));
  }
}
