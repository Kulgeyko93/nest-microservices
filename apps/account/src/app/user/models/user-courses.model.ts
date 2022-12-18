import { Document } from 'mongoose';
import { IUserCourses, PurchaseState } from '@microservices/interfaces'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserCourses extends Document implements IUserCourses {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, enum: PurchaseState, type: String })
  purchaseState:PurchaseState;
}

export  const UserCoursesSchema = SchemaFactory.createForClass(UserCourses);
