import { User } from "@prisma/client";

export class RegisterUserDto implements Pick<User, 'email'| 'password' | 'name'>{
    email: string;
    password: string;
    name: string;
}
