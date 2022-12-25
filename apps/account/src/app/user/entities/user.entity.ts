import { IDomaitEvent, IUser, IUserCourses, PurchaseState, UserRole } from "@microservices/interfaces";
import { genSalt, hash, compare } from 'bcrypt'
import { AccountChangedCourse } from "@microservices/contracts";

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
  events: IDomaitEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName,
    }
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const exist = this.courses.find((course) => course.courseId === courseId);
    if (!exist) {
      this.courses.push({
        courseId,
        purchaseState: state,
      });
      
      return this;
    }
    if (state === PurchaseState.Canceled) {
      this.courses.filter((course) => course.courseId !== courseId);
      return this;
    }
    this.courses = this.courses.map((course) => {
      if (course.courseId !== courseId) return course;

      course.purchaseState = state;
      return course;
    });

    this.events.push({ 
      topic: AccountChangedCourse.topic,
      data: { courseId, userId: this._id, state }
    });
    return this;
  }

  public getCourseState(courseId: string): PurchaseState {
    return this.courses.find(c => c.courseId === courseId)?.purchaseState ?? PurchaseState.Started;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }
}
