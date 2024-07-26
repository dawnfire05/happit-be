import { Module } from '@nestjs/common';
import { UserController } from './User.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
