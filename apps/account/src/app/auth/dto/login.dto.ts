import { User } from "@prisma/client";

export class LoginDto implements Pick<User, 'email'| 'password'>{
    email: string;
    password: string;
}
