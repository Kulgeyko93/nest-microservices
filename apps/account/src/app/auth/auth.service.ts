import { UserRepository } from './../user/repositories/user.repository';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserEntity } from "../user/entites/user.entity";
import { Roles } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
  private readonly userRepository: UserRepository,
  ) {}
  async register({ email, password, name }: RegisterUserDto) {
    const existUser = await this.userRepository.findOneByEmail(email);

    if (existUser) {
      throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
    }

    const newUserEntity = await new UserEntity({
      email,
      name,
      password: '',
      role: Roles.USER,
    }).setPassword(password);

    const newUser = await this.userRepository.create(newUserEntity);

    return { email: newUser.email }
  }

  async validate(email: string, password: string ) {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Uncorrect email or password');
    }

    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new BadRequestException('Uncorrect email or password');
    }

    return { id: user.id };
  }
}
