import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { InvalidTokenException } from '../../common/exceptions/invalid-token.exception';
import { VerficationNotFoundException } from 'src/common/exceptions/verification-not-found.exception';
import { AlreadyExistEmailException } from '../../common/exceptions/already-exist-email.exception';
import { NotMatchedPasswordException } from '../../common/exceptions/not-matched-password.exception';
import { EmailNotVerifiedException } from 'src/common/exceptions/email-not-verified.exception';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { ResponseEntity } from '../../common/response/response-entity';
import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth-token.dto';
import { RefreshTokensRequestDto } from './dto/refresh-tokens-request.dto';
import { VerifyEmailRequestDto } from './dto/verify-email-request.dto';
import { EmailRequestDto } from './dto/email-request.dto';
import { SigninRequestDto } from './dto/signin-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입 API', description: '이메일 인증을 거친 후 회원가입 합니다.' })
  @ApiSuccessResponse(HttpStatus.CREATED)
  @ApiErrorResponse(AlreadyExistEmailException, VerficationNotFoundException, EmailNotVerifiedException)
  async signup(@Body() signupRequest: SignupRequestDto) {
    await this.authService.signup(signupRequest);

    return ResponseEntity.OK();
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인 API', description: '로그인 후 토큰을 발급해줍니다.' })
  @ApiSuccessResponse(HttpStatus.OK, AuthTokenDto)
  @ApiErrorResponse(UserNotFoundException, NotMatchedPasswordException)
  async signin(@Body() signinRequest: SigninRequestDto) {
    const tokens = await this.authService.signin(signinRequest);

    return ResponseEntity.OK_WITH_DATA(AuthTokenDto.of(tokens));
  }

  @Post('/refresh-tokens')
  @ApiOperation({ summary: 'refreshToken 재발급 API', description: '만료된 AccessToken을 재발급 합니다.' })
  @ApiSuccessResponse(HttpStatus.OK, AuthTokenDto)
  @ApiErrorResponse(InvalidTokenException)
  async refreshAuthToken(@Body() refreshTokensRequest: RefreshTokensRequestDto) {
    const tokens = await this.authService.refreshAuthToken(refreshTokensRequest.refreshToken);

    return ResponseEntity.OK_WITH_DATA(AuthTokenDto.of(tokens));
  }

  @Post('/emails')
  @ApiOperation({ summary: 'email 발송 API', description: '가입하지 않은 회원에 대해 이메일을 발송합니다.' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(AlreadyExistEmailException)
  async sendEmail(@Body() sendEmailRequest: EmailRequestDto) {
    await this.authService.sendEmail(sendEmailRequest);

    return ResponseEntity.OK();
  }

  @Get('/verifications/:email')
  @ApiOperation({ summary: 'email 검증 확인 API', description: '이메일 인증이 정상적으로 되었는지 확인합니다.' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(EmailNotVerifiedException)
  async checkVerification(@Param('email') email: string) {
    await this.authService.checkVerification(email);

    return ResponseEntity.OK();
  }

  @Post('/verify-email')
  @ApiOperation({ summary: 'email 검증 API', description: '전송한 code로 이메일을 인증합니다.' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(VerficationNotFoundException)
  async verifyEmail(@Body() verifyEmailRequestDto: VerifyEmailRequestDto) {
    await this.authService.verifyEmail(verifyEmailRequestDto);

    return ResponseEntity.OK();
  }
}
