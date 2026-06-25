import { z } from 'zod';

const createComplaintValidationSchema = z.object({
    body: z.object({
        name: z.string({ message: 'Name is required' }),
        phone: z.string({ message: 'Phone is required' }).regex(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
        email: z.string({ message: 'Email is required' }),
        subject: z.string({ message: 'Subject is required' }),
        message: z.string({ message: 'Message is required' }),
    }),
});

const paginationValidation = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }).strict().optional(),
});

const deleteValidation = z.object({
    params: z.object({
        id: z.string().uuid({ message: 'Invalid complaint ID' }),
    }).strict(),
});

export const complaintValidationSchema = {
    createComplaintValidationSchema,
    paginationValidation,
    deleteValidation,
};
