import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@chat/prisma-client'
import { UserEntity } from "../entites/user.entity";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaClientService) {}

  create(user: UserEntity) {
    const newUser = this.prisma.user.create({
      data: user
    });
  
    return newUser;
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email
      }
    });
  }
}
