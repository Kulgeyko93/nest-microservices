import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountChangeProfile } from '@microservices/contracts';
import { UserRepository } from './repositories/user.repository';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQRoute(AccountChangeProfile.topic)
  @RMQValidate()
  async userInfo(@Body() { user, id }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
    const existedUser = await this.userRepository.findUserById(id);

    if (!existedUser) {
      throw new NotFoundException('User doesn\'t exist');
    }

    const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
    await this.userRepository.updateUser(userEntity);

    return {};
  }
}
