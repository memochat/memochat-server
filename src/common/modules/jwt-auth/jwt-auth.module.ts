import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../app/user/user.entity';
import { JwtConfigModule } from '../../config/jwt/config.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule, JwtConfigModule, TypeOrmModule.forFeature([User])],
  providers: [JwtStrategy],
})
export class JwtAuthModule {}
