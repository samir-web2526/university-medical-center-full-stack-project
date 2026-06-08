import { Gender } from '../../generated/client';

export interface IDoctorFilters {
    searchTerm?: string;
    name?: string;
    email?: string;
    gender?: Gender;
    specialization?: string;
    qualification?: string;
}

export interface IDoctorUpdate {
    gender?: Gender;
    qualification?: string;
    specialization?: string;
    imageUrl?: string;
}