import { z } from 'zod';

const createBlogValidationSchema = z.object({
    body: z.object({
        title: z.string({ message: 'Title is required' }),
        content: z.string({ message: 'Content is required' }),
        coverImage: z.string().optional(),
    }),
});

const updateBlogValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
    }),
});

export const blogValidationSchema = {
    createBlogValidationSchema,
    updateBlogValidationSchema,
};