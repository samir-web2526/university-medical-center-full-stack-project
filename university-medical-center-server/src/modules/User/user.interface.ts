import { Role, UserStatus } from '../../generated/client';

export type TUser = {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};