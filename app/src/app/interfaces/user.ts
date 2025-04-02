export interface User {
    _id: string;
    fullName: string;
    telegram?: string;
    username: string;
    password: string;
    role: string;
    plan: object;
    createdAt: Date;
    updatedAt: Date;
}