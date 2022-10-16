import { Module } from '@nestjs/common';
import { HashService } from '../auth/hash.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [HashService, UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
