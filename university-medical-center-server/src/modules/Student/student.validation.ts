import { z } from 'zod';
import { BloodGroup, Gender, UserStatus } from '../../generated/enums';

const updateStudentValidationSchemaByOwn = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        gender: z.enum(Gender).optional(),
        bloodGroup: z.enum(BloodGroup).optional(),
        imageUrl: z.string().url().optional(),
    }).strict(),
});

const updateStudentValidationSchemaByAdmin = z.object({
    body: z.object({
        studentId: z.string().optional(),

        department: z.string().optional(),

        session: z.string().optional(),

        gender: z.enum(Gender).optional(),

        bloodGroup: z.enum(BloodGroup).optional(),
        status: z.enum(UserStatus).optional(),
    }).strict(),
});

export const studentValidation = {
    updateStudentValidationSchemaByOwn,
    updateStudentValidationSchemaByAdmin
};