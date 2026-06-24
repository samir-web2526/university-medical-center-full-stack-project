import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { paginationHelper } from '../../sharedFile/paginationHelper';
import { TComplaint } from './complaint.interface';
import { ComplaintSearchableFields } from './complaint.constant';

const createComplaint = async (payload: TComplaint, userId?: string) => {
    const result = await prisma.complaint.create({
        data: {
            name: payload.name,
            phone: payload.phone,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
            userId: userId ?? null,
        },
    });

    return result;
};

const getAllComplaints = async (options: any, filters: any) => {
    const { page, limit, skip } =
        paginationHelper.calculatePagination(options);

    const { searchTerm } = filters;

    const whereCondition = {
        ...(searchTerm && {
            OR: ComplaintSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        }),
    };

    const complaints = await prisma.complaint.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
    });

    const total = await prisma.complaint.count({
        where: whereCondition,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: complaints,
    };
};

const markAsRead = async (id: string) => {
    const complaint = await prisma.complaint.findUnique({ where: { id } });

    if (!complaint) {
        throw new AppError(status.NOT_FOUND, 'Complaint not found');
    }

    return prisma.complaint.update({
        where: { id },
        data: { isRead: true },
    });
};

const markAllAsRead = async () => {
    await prisma.complaint.updateMany({
        where: { isRead: false },
        data: { isRead: true },
    });

    return null;
};

const deleteComplaint = async (id: string) => {
    const complaint = await prisma.complaint.findUnique({
        where: { id },
    });

    if (!complaint) {
        throw new AppError(status.NOT_FOUND, 'Complaint not found');
    }

    return prisma.complaint.delete({
        where: { id },
    });
};

export const ComplaintService = {
    createComplaint,
    getAllComplaints,
    markAsRead,
    markAllAsRead,
    deleteComplaint,
};
