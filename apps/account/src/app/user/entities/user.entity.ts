import { IUser, IUserCourses, PurchaseState, UserRole } from "@microservices/interfaces";
import { genSalt, hash, compare } from 'bcrypt'

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];

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

  public addCourse(courseId: string) {
    const exist = this.courses.find((course) => course._id === courseId);
    if (exist) {
      throw new Error('This course exist')
    }

    this.courses.push({
      courseId,
      purchaseState: PurchaseState.Started,
    });
  }

  public updateCourseStatus(courseId: string, state: PurchaseState) {
    this.courses = this.courses.map((course) => {
      if (course._id !== courseId) return course;

      course.purchaseState = state;
      return course;
    });
  }

  public deleteCourse(courseId: string) {
    this.courses = this.courses.filter((course) => course._id !== courseId);
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
