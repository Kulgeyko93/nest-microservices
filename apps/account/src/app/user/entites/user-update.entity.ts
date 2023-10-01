import { compare, genSalt, hash } from 'bcrypt';
import { User, Roles } from "@prisma/client";

export class UserUpdateEntity implements User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: Roles;
    createdAt: Date;
    updatedAt: Date;
    refreshToken: string;

    public async setRefreshToken(refreshToken: string) {
        const salt = await genSalt(15);
        this.refreshToken = await hash(refreshToken, salt);
        return this;
    }

    public validatePassword(password: string) {
        return compare(password, this.password);
    }
}
