import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@microservices/interfaces';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@microservices/contracts';


@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register({email, password, displayName}: AccountRegister.Request) {
    const existUser = await this.userRepository.findUser(email);
    if (existUser) {
      throw new Error('User exists');
    }
    const user = await new UserEntity({
      displayName,
      email,
      passwordHash: '',
      role:  UserRole.Student,
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(user);
    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new NotFoundException('User doesn`t exist');
    }

    const userEntity = await new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new BadRequestException('Uncorrect password');
    }
    return { id: user._id };
  }

  async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({ id }),
    }
  }

}
