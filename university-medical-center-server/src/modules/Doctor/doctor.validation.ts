import z from 'zod';

export const doctorValidationSchema = {
    updateDoctor: z.object({
        body: z.object({
            gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
            qualification: z.string().optional(),
            specialization: z.string().optional(),
            imageUrl: z.string().url().optional(),
        }).strict(),
    }),
};