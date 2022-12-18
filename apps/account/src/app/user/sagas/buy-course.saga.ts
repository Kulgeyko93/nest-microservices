import { RMQService } from "nestjs-rmq";
import { PurchaseState } from "@microservices/interfaces";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(private user: UserEntity, private courseId: string, private rmqService: RMQService) {}

  setState(courseId: string, state: PurchaseState) {
    switch(state) {
      case PurchaseState.Started:
        break;
      case PurchaseState.WaitingForPayment:
        break;
      case PurchaseState.Purchased: 
        break
      case PurchaseState.Canceled: 
        break
    }

    // set context
    this.state.setContxt(this);
    this.user.updateCourseStatus(courseId, state);
  }

  getState() {
    return this.state;
  }
}
