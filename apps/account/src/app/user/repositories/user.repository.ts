import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@chat/prisma-client'
import { UserEntity } from "../entites/user.entity";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaClientService) {}

  create(user: UserEntity) {
    const newUser = this.prisma.user.create({
      data: user
    });
  
    return newUser;
  }

  findOneById(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id
      }
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email
      }
    });
  }

  async update(id: string, data: Partial<Omit<User, 'id'>>) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return user;
  }
}
