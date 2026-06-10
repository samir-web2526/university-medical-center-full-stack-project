import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { paginationHelper } from '../../sharedFile/paginationHelper';
import { Prisma } from '../../generated/client';
import { TNotification } from './notification.interface';
import { NotificationSearchableFields } from './notification.constant';

const createNotification = async (
    payload: TNotification,
    existingTx?: Prisma.TransactionClient
) => {
    if (existingTx) {
        return await existingTx.notification.create({
            data: payload,
        });
    }

    return await prisma.notification.create({
        data: payload,
    });
};

const getMyNotifications = async (
    userId: string,
    options: any,
    filters: any
) => {
    const { page, limit, skip } =
        paginationHelper.calculatePagination(options);

    const { searchTerm } = filters;

    const whereCondition = {
        userId,
        ...(searchTerm && {
            OR: NotificationSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        }),
    };

    const notifications = await prisma.notification.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
    });

    const total = await prisma.notification.count({
        where: whereCondition,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: notifications,
    };
};

const getAllNotifications = async (options: any, filters: any) => {
    const { page, limit, skip } =
        paginationHelper.calculatePagination(options);

    const { searchTerm } = filters;

    const whereCondition = {
        ...(searchTerm && {
            OR: NotificationSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        }),
    };

    const notifications = await prisma.notification.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc',
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

    const total = await prisma.notification.count({
        where: whereCondition,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: notifications,
    };
};

const markAsRead = async (id: string, userId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id },
    });

    if (!notification || notification.userId !== userId) {
        throw new AppError(status.NOT_FOUND, 'Notification not found');
    }

    return prisma.notification.update({
        where: { id },
        data: { isRead: true },
    });
};

const markAllAsRead = async (userId: string) => {
    return await prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
};

const getUnreadNotificationCount = async (userId: string) => {
    const count = await prisma.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });

    return count;
};

const deleteNotification = async (id: string, userId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id },
    });

    if (!notification || notification.userId !== userId) {
        throw new AppError(status.NOT_FOUND, 'Notification not found');
    }

    return prisma.notification.delete({
        where: { id },
    });
};

export const NotificationService = {
    createNotification,
    getMyNotifications,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadNotificationCount,
    deleteNotification,
};