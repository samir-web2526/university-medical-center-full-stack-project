import { Request, Response } from 'express';
import catchAsync from '../../sharedFile/catchAsync';
import sendResponse from '../../sharedFile/sendResponse';
import status from 'http-status';
import { NotificationService } from './notification.service';
import pick from '../../sharedFile/pick';

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await NotificationService.getMyNotifications(user.id, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Notifications retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await NotificationService.getAllNotifications(options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All notifications retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;

    const result = await NotificationService.markAsRead(id as string, user.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Notification marked as read successfully',
        data: result,
    });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;

    const result = await NotificationService.markAllAsRead(user.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All notifications marked as read successfully',
        data: result,
    });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await NotificationService.deleteNotification(id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Notification deleted successfully',
        data: result,
    });
});

export const NotificationController = {
    getMyNotifications,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};