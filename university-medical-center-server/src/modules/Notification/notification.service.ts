import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { paginationHelper } from '../../sharedFile/paginationHelper';
import { Prisma } from '../../generated/client';
import { TNotification } from './notification.interface';

const createNotification = async (
    payload: TNotification,
    existingTx?: Prisma.TransactionClient
) => {
    // Avoid duplicate notifications (e.g., if a system alert with the same title/message already exists and is unread)
    const operation = async (tx: Prisma.TransactionClient) => {
        // Optional: Check for duplicate active notification to prevent spam
        const existing = await tx.notification.findFirst({
            where: {
                userId: payload.userId,
                type: payload.type,
                title: payload.title,
                message: payload.message,
                isRead: false,
                medicineId: payload.medicineId,
                prescriptionId: payload.prescriptionId,
            },
        });

        if (existing) {
            return existing; // Return existing if it's already there and unread to avoid spam
        }

        const result = await tx.notification.create({
            data: payload,
        });

        return result;
    };

    if (existingTx) {
        return await operation(existingTx);
    }

    return await prisma.$transaction(operation);
};

const getMyNotifications = async (userId: string, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: {
            [sortBy || 'createdAt']: sortOrder || 'desc',
        },
    });

    const total = await prisma.notification.count({
        where: { userId },
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getAllNotifications = async (options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.notification.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy || 'createdAt']: sortOrder || 'desc',
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    const total = await prisma.notification.count();

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const markAsRead = async (id: string, userId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id },
    });

    if (!notification) {
        throw new AppError(status.NOT_FOUND, 'Notification not found');
    }

    if (notification.userId !== userId) {
        throw new AppError(status.FORBIDDEN, 'Access denied');
    }

    const result = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
    });

    return result;
};

const markAllAsRead = async (userId: string) => {
    const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });

    return result;
};

const deleteNotification = async (id: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id },
    });

    if (!notification) {
        throw new AppError(status.NOT_FOUND, 'Notification not found');
    }

    const result = await prisma.notification.delete({
        where: { id },
    });

    return result;
};

export const NotificationService = {
    createNotification,
    getMyNotifications,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};