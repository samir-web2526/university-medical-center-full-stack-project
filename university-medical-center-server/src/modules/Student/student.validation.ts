import { z } from 'zod';

const updateStudentValidationSchemaByOwn = z.object({
    body: z.object({
        gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
        bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE']).optional(),
        imageUrl: z.string().url().optional(),
    }).strict(),
});

const updateStudentValidationSchemaByAdmin = z.object({
    body: z.object({
        studentId: z.string().optional(),

        department: z.string().optional(),

        session: z.string().optional(),

        gender: z.enum([
            'MALE',
            'FEMALE',
            'OTHER',
        ]).optional(),

        bloodGroup: z.enum([
            'A_POSITIVE',
            'A_NEGATIVE',
            'B_POSITIVE',
            'B_NEGATIVE',
            'O_POSITIVE',
            'O_NEGATIVE',
            'AB_POSITIVE',
            'AB_NEGATIVE',
        ]).optional(),

        imageUrl: z.string().url().optional(),
    }).strict(),
});

export const studentValidation = {
    updateStudentValidationSchemaByOwn,
    updateStudentValidationSchemaByAdmin
};