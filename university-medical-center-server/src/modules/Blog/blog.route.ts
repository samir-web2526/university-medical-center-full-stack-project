import express from 'express';
import { BlogController } from './blog.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { blogValidationSchema } from './blog.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../generated/enums';

const router = express.Router();

router.post(
    '/',
    checkAuth(Role.DOCTOR),
    validateRequest(blogValidationSchema.createBlogValidationSchema),
    BlogController.createBlog
);

router.get(
    '/my-blogs',
    checkAuth(Role.DOCTOR),
    BlogController.getMyBlogs
);

router.get(
    '/',
    BlogController.getBlogs
);

router.get(
    '/:id',
    BlogController.getBlogById
);


router.patch(
    '/:id',
    checkAuth(Role.DOCTOR),
    validateRequest(blogValidationSchema.updateBlogValidationSchema),
    BlogController.updateBlog
);

router.delete(
    '/:id',
    checkAuth(Role.DOCTOR),
    BlogController.deleteBlog
);

export const BlogRoutes = router;
