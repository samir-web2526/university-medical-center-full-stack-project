import z from 'zod';
import { Gender, UserStatus } from '../../generated/enums';

export const doctorValidationSchema = {
    updateMyProfile: z.object({
        body: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            gender: z.enum(Gender).optional(),
            qualification: z.string().optional(),
            specialization: z.string().optional(),
            imageUrl: z.string().url().optional(),
        }).strict(),
    }),

    updateDoctor: z.object({
        body: z.object({
            gender: z.enum(Gender).optional(),
            status: z.enum(UserStatus).optional(),
            qualification: z.string().optional(),
            specialization: z.string().optional(),
        }).strict(),
    }),
};
