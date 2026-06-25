import { z } from 'zod';
import { Role, Gender, BloodGroup, UserStatus } from '../../generated/client';

export const registerUserValidationSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'Name is required',
        }),
        email: z.string({
            message: 'Email is required',
        }).email('Invalid email address'),
        password: z.string({
            message: 'Password is required',
        }).min(6, 'Password must be at least 6 characters'),
        role: z.literal(Role.STUDENT, {
            message: 'Only STUDENT role can self-register',
        }),
        student: z.object({
            studentId: z.string({
                message: 'Student ID is required',
            }),
            department: z.string({
                message: 'Department is required',
            }),
            session: z.string({
                message: 'Session is required',
            }),
            phone: z.string().regex(/^\d{0,11}$/, 'Phone number must be at most 11 digits').optional().nullable(),
            gender: z.nativeEnum(Gender).optional().nullable(),
            bloodGroup: z.nativeEnum(BloodGroup).optional().nullable(),
            imageUrl: z.string().url('Invalid image URL').optional().nullable(),
            presentAddress: z.string().optional().nullable(),
            permanentAddress: z.string().optional().nullable(),
            guardianNumber: z.string().regex(/^\d{0,11}$/, 'Guardian number must be at most 11 digits').optional().nullable(),
        }).optional(),
    }),
});

export const createDoctorValidationSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'Name is required',
        }),
        email: z.string({
            message: 'Email is required',
        }).email('Invalid email address'),
        temporaryPassword: z.string().optional(),
    }),
});

export const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            message: 'Old password is required',
        }),
        newPassword: z.string({
            message: 'New password is required',
        }).min(6, 'Password must be at least 6 characters'),
    }),
});

export const updateDoctorProfileValidationSchema = z.object({
    body: z.object({
        phone: z.string().regex(/^\d{0,11}$/, 'Phone number must be at most 11 digits').optional().nullable(),
        gender: z.nativeEnum(Gender).optional().nullable(),
        qualification: z.string().optional().nullable(),
        specialization: z.string().optional().nullable(),
        bmdcRegistrationNumber: z.string().optional().nullable(),
        imageUrl: z.string().url('Invalid image URL').optional().nullable(),
    }),
});

export const loginUserValidationSchema = z.object({
    body: z.object({
        email: z.string({
            message: 'Email is required',
        }).email('Invalid email address'),
        password: z.string({
            message: 'Password is required',
        }),
    }),
});

export const forgotPasswordValidationSchema = z.object({
    body: z.object({
        email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    }),
});

export const resetPasswordValidationSchema = z.object({
    body: z.object({
        token: z.string({ message: 'Token is required' }),
        newPassword: z.string({ message: 'New password is required' }).min(8, 'Password must be at least 8 characters'),
    }),
});

export const updateAdminProfileValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email('Invalid email address').optional(),
        phone: z.string().regex(/^\d{0,11}$/, 'Phone number must be at most 11 digits').optional().nullable(),
    }).strict(),
});

export const updateUserStatusValidationSchema = z.object({
    body: z.object({
        status: z.nativeEnum(UserStatus, {
            message: 'Invalid status',
        }),
    }),
});

export const userValidationSchema = {
    registerUserValidationSchema,
    createDoctorValidationSchema,
    changePasswordValidationSchema,
    updateDoctorProfileValidationSchema,
    updateAdminProfileValidationSchema,
    loginUserValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
    updateUserStatusValidationSchema,
};