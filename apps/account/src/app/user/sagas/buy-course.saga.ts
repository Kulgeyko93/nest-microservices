import { RMQService } from "nestjs-rmq";
import { PurchaseState } from "@microservices/interfaces";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { BuyCourseSagaStateCanceld, BuyCourseSagaStatePurchased, BuyCourseSagaStateWaitingForPayment, BuyCourseSagaStateStarted } from "./buy-course.steps";

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) {}

  setState(courseId: string, state: PurchaseState) {
    switch(state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted();
        break;
      case PurchaseState.WaitingForPayment:
        this.state === new BuyCourseSagaStateWaitingForPayment();
        break;
      case PurchaseState.Purchased: 
        this.state === new BuyCourseSagaStatePurchased();
        break
      case PurchaseState.Canceled:
      this.state === new BuyCourseSagaStateCanceld();
        break
    }

    this.state.setContext(this);
    this.user.setCourseStatus(courseId, state);
  }

  getState() {
    return this.state;
  }
}
