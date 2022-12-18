import { RMQService } from "nestjs-rmq";
import { PurchaseState } from "@microservices/interfaces";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { BuyCourseSagaStateStarted } from "./buy-course.steps";

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) {}

  setState(courseId: string, state: PurchaseState) {
    switch(state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted()
        break;
      case PurchaseState.WaitingForPayment:
        break;
      case PurchaseState.Purchased: 
        break
      case PurchaseState.Canceled: 
        break
    }

    this.state.setContext(this);
    this.user.updateCourseStatus(courseId, state);
  }

  getState() {
    return this.state;
  }
}
