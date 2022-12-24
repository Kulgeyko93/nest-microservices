import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@microservices/contracts';
import { UserService } from './user.service';

@Controller()
export class UserCommands {
  constructor(
    private readonly userService: UserService,
  ) {}

  @RMQRoute(AccountChangeProfile.topic)
  @RMQValidate()
  async changeProfile(@Body() { user, id }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
    return await this.userService.changeProfile(user, id);
  }

  @RMQRoute(AccountBuyCourse.topic)
  @RMQValidate()
  async buyCourse(@Body() { userId, courseId }: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    return await this.userService.buyCourse(userId, courseId);
  }

  @RMQRoute(AccountCheckPayment.topic)
  @RMQValidate()
  async checkPayment(@Body() { userId, courseId }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    return await this.userService.checkPayment(userId, courseId);
  }
}
