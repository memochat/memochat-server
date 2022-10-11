import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  @ApiSuccessResponse(HttpStatus.CREATED)
  @ApiErrorResponse(AlreadyExistEmailException, VerficationNotFoundException, EmailNotVerifiedException)
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

  @Post('/emails')
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(AlreadyExistEmailException)
  async sendEmail(@Body() sendEmailRequest: EmailRequestDto) {
    await this.authService.sendEmail(sendEmailRequest);

    return ResponseEntity.OK();
  }

  @Get('/verifications/:email')
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(EmailNotVerifiedException)
  async checkVerification(@Param('email') email: string) {
    await this.authService.checkVerification(email);

    return ResponseEntity.OK();
  }

  @Post('/verify-email')
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(VerficationNotFoundException)
  async verifyEmail(@Body() verifyEmailRequestDto: VerifyEmailRequestDto) {
    await this.authService.verifyEmail(verifyEmailRequestDto);

    return ResponseEntity.OK();
  }
}
