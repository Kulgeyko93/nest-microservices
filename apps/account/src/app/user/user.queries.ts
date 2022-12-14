import { Body, Controller } from '@nestjs/common';
import { AccountUserCourses, AccountUserInfo } from '@microservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';

@Controller()
export class UserQueries {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQRoute(AccountUserInfo.topic)
  @RMQValidate()
  async userInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
    const user = await this.userRepository.findUserById(id);
    return { user };
  }

  @RMQRoute(AccountUserCourses.topic)
  @RMQValidate()
  async yserCourses(@Body() { id }: AccountUserCourses.Request): Promise<AccountUserCourses.Response> {
    const user = await this.userRepository.findUserById(id);
    return { courses: user.courses };
  }
}
