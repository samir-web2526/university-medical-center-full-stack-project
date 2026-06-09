import { z } from 'zod';

const paginationValidation = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }).strict().optional(),
});

const markAsReadValidation = z.object({
    params: z.object({
        id: z.string().uuid({ message: 'Invalid notification ID' }),
    }).strict(),
});

const deleteValidation = z.object({
    params: z.object({
        id: z.string().uuid({ message: 'Invalid notification ID' }),
    }).strict(),
});

export const notificationValidationSchema = {
    paginationValidation,
    markAsReadValidation,
    deleteValidation,
};