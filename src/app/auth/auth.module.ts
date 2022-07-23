import { Module } from '@nestjs/common';
import { TokenModule } from '../../common/modules/token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, HashService],
})
export class AuthModule {}
