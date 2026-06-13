import { Gender, UserStatus } from '../../generated/client';

export interface IDoctorFilters {
    searchTerm?: string;
    name?: string;
    email?: string;
    gender?: Gender;
    specialization?: string;
    qualification?: string;
}

export interface IDoctorSelfUpdate {
    name?: string;
    email?: string;
    phone?: string;
    gender?: Gender;
    qualification?: string;
    specialization?: string;
    imageUrl?: string;
}

export interface IAdminUpdateDoctor {
    gender?: Gender;
    status?: UserStatus;
    qualification?: string;
    specialization?: string;
}