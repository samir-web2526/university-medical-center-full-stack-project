import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../sharedFile';
import status from 'http-status';
import { BlogService } from './blog.service';

const createBlog = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user.id;
    const result = await BlogService.createBlog(authorId, req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Blog created successfully',
        data: result,
    });
});

const getBlogs = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogService.getBlogs();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Blogs fetched successfully',
        data: result,
    });
});

const getBlogById = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogService.getBlogById(req.params.id as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Blog fetched successfully',
        data: result,
    });
});

const getMyBlogs = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user.id;
    const result = await BlogService.getMyBlogs(authorId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'My blogs fetched successfully',
        data: result,
    });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user.id;
    const result = await BlogService.updateBlog(req.params.id as string, authorId, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Blog updated successfully',
        data: result,
    });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user.id;
    const result = await BlogService.deleteBlog(req.params.id as string, authorId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Blog deleted successfully',
        data: result,
    });
});

export const BlogController = {
    createBlog,
    getBlogs,
    getBlogById,
    getMyBlogs,
    updateBlog,
    deleteBlog,
};