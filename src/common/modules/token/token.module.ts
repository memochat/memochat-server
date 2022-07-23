import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfigModule } from '../../config/jwt/config.module';
import { JwtConfigService } from '../../config/jwt/config.service';
import { Token } from './token.entity';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtConfigModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secret,
      }),
      inject: [JwtConfigService],
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
