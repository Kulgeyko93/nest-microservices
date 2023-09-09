import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { PrismaClientService } from '@chat/prisma-client';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserRepository, PrismaClientService],
  exports: [UserRepository],
})
export class UserModule {}
