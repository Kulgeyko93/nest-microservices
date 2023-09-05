import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaClientService } from '@chat/prisma-client';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaClientService],
})
export class UserModule {}
