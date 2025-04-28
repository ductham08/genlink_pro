export interface User {
    _id: string;
    fullName: string;
    telegram?: string;
    username: string;
    password: string;
    role: string;
    plan: {
        type: string;
        usedLinks: number;
        totalLinks: number;
        registeredAt: Date
    };
    createdAt: Date;
    updatedAt: Date;
}