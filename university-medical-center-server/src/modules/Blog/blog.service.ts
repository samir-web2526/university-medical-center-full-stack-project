import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { TBlog } from './blog.interface';

const createBlog = async (authorId: string, payload: TBlog) => {
    const result = await prisma.blog.create({
        data: {
            title: payload.title as string,
            content: payload.content as string,
            coverImage: payload.coverImage,
            authorId,
        },
    });

    return result;
};

const getBlogs = async () => {
    const result = await prisma.blog.findMany({
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
    return result;
};

const getBlogById = async (id: string) => {
    const result = await prisma.blog.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
    });
    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Blog not found');
    }
    return result;
};

const getMyBlogs = async (authorId: string) => {
    const result = await prisma.blog.findMany({
        where: { authorId },
        orderBy: { createdAt: 'desc' },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
    });
    return result;
};

const updateBlog = async (id: string, authorId: string, payload: Partial<TBlog>) => {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
        throw new AppError(status.NOT_FOUND, 'Blog not found');
    }
    if (blog.authorId !== authorId) {
        throw new AppError(status.FORBIDDEN, 'You are not the owner of this blog');
    }

    const result = await prisma.blog.update({
        where: { id },
        data: payload,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
    });
    return result;
};

const deleteBlog = async (id: string, authorId: string) => {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
        throw new AppError(status.NOT_FOUND, 'Blog not found');
    }
    if (blog.authorId !== authorId) {
        throw new AppError(status.FORBIDDEN, 'You are not the owner of this blog');
    }

    const result = await prisma.blog.delete({
        where: { id },
    });
    return result;
};

export const BlogService = {
    createBlog,
    getBlogs,
    getBlogById,
    getMyBlogs,
    updateBlog,
    deleteBlog,
};