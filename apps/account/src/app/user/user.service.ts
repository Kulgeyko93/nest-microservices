import { Injectable, NotFoundException } from "@nestjs/common";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "./entities/user.entity";
import { User } from "./models/user.model";
import { UserRepository } from "./repositories/user.repository";
import { BuyCourseSaga } from "./sagas/buy-course.saga";
import { UserEventEmmiter } from "./user.event-emmiter";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userEventEmmiter: UserEventEmmiter,
    private readonly rmqService: RMQService,
  ) {}

  async changeProfile(user: Pick<User, 'displayName'>, id: string) {
    const existedUser = await this.userRepository.findUserById(id);

    if (!existedUser) {
      throw new NotFoundException('User doesn\'t exist');
    }

    const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
    
    await this.updateUser(userEntity);
    return {};
  }

  async buyCourse(userId: string, courseId: string){
    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser) {
      throw new NotFoundException('user doesn\'t exist');
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, paymentLink } = await saga.getState().pay();

    await this.updateUser(user);
    return { paymentLink };
  }

  async checkPayment(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser) {
      throw new NotFoundException('user doesn\'t exist');
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();

    await this.updateUser(user);
    return { status }
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmmiter.handle(user),
      this.userRepository.updateUser(user),
    ]);
  }
}
