import { compare, genSalt, hash } from 'bcrypt';
import { User, Roles } from "@prisma/client";

export class UserEntity implements User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: Roles;
    createdAt: Date;
    updatedAt: Date;
    refreshToken: string;

    constructor(user: Pick<User, 'email'| 'name' | 'role' | 'password'>) {
        this.email = user.email;
        this.password = user.password;
        this.name = user.name;
        this.role = user.role;
    }

    public async setPassword(password: string) {
        const salt = await genSalt(10);
        this.password = await hash(password, salt);
        return this;
    }

    public validatePassword(password: string) {
        return compare(password, this.password);
    }
}
