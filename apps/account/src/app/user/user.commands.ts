import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@microservices/contracts';
import { UserRepository } from './repositories/user.repository';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';

@Controller()
export class UserCommands {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
  ) {}

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

  @RMQRoute(AccountBuyCourse.topic)
  @RMQValidate()
  async buyCourse(@Body() { userId, courseId }: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser) {
      throw new NotFoundException('user doesn\'t exist');
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, paymentLink } = await saga.getState().pay();

    await this.userRepository.updateUser(user);

    return { paymentLink };
  }

  @RMQRoute(AccountCheckPayment.topic)
  @RMQValidate()
  async checkPayment(@Body() { userId, courseId }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser) {
      throw new NotFoundException('user doesn\'t exist');
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();

    await this.userRepository.updateUser(user);


    return { status }


  }
}
