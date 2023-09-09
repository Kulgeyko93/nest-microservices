export enum Roles {
    ADMIN = 'admin',
    user = 'user'
}

export interface IUser {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: Roles;
}
