import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../../common/modules/token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { Verification } from './verification.entity';

@Module({
  imports: [UserModule, TokenModule, TypeOrmModule.forFeature([Verification])],
  controllers: [AuthController],
  providers: [AuthService, HashService],
})
export class AuthModule {}
