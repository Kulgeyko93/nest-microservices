import { CourseGetCourse, PaymentGenerateLink } from "@microservices/contracts";
import { NotFoundException } from "@nestjs/common";
import { PurchaseState } from "@microservices/interfaces";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string, user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
      id: this.saga.courseId,
    });

    if (!course) {
      throw new NotFoundException('Course doesn\'t exist');
    }

    if (course.price === 0) {
      this.saga.setState(this.saga.courseId, PurchaseState.Purchased);
      return { paymentLink: null, user: this.saga.user }
    }

    const { paymentLink } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    });

    this.saga.setState(course._id, PurchaseState.WaitingForPayment);

    return {
      paymentLink, user: this.saga.user,
    }
  }

  public checkPayment(): Promise<{ user: UserEntity; }> {
    throw new Error("Cant check payment");
  }

  public async cancel(): Promise<{ user: UserEntity; }> {
    this.saga.setState(this.saga.courseId, PurchaseState.Canceled);
    return { user: this.saga.user }
  }
  
}
