import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCoursesSchema } from './models/user-courses.model';
import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { UserCommands } from './user.commands';
import { UserQueries } from './user.queries';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      // { name: User.name, schema: UserCoursesSchema },
    ])
  ],
  controllers: [UserCommands, UserQueries],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
