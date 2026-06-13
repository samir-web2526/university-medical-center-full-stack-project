import { Prisma } from "../../generated/client";
import { prisma } from "../../lib/prisma";
import { studentSearchableFields } from "./student.constant";
import { paginationHelper } from "../../sharedFile/paginationHelper";
import AppError from "../../errorHelpers/appError";
import status from "http-status";

const getMyProfile = async (userId: string) => {
    const result = await prisma.student.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    isActive: true,
                }
            }
        }
    });

    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Student not found');
    }

    return result;
};

const updateMyProfile = async (userId: string, payload: any) => {
    const student = await prisma.student.findUnique({
        where: { userId },
    });

    if (!student) {
        throw new Error('Student not found');
    }

    const { name, email, phone, ...studentData } = payload;

    if (name || email || phone) {
        const userPayload: Record<string, any> = {};
        if (name) userPayload.name = name;
        if (email) userPayload.email = email;
        if (phone) userPayload.phone = phone;
        await prisma.user.update({ where: { id: userId }, data: userPayload });
    }

    const result = await prisma.student.update({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    isActive: true,
                }
            }
        },
        data: studentData,
    });

    return result;
};

const getAllStudents = async (filters: any, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.StudentWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: studentSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.StudentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.student.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    isActive: true,
                }
            }
        }
    });

    const total = await prisma.student.count({
        where: whereConditions,
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

const updateStudent = async (id: string, payload: any) => {
    const student = await prisma.student.findUnique({
        where: { id },
    });

    if (!student) {
        throw new AppError(status.NOT_FOUND, 'Student not found');
    }

    if ((payload.department || payload.session) && !payload.studentId) {
        throw new AppError(
            status.BAD_REQUEST,
            'studentId is required when academic info (department/session) is updated'
        );
    }

    if (payload.studentId) {
        const existing = await prisma.student.findFirst({
            where: {
                studentId: payload.studentId,
                id: { not: id },
            },
        });

        if (existing) {
            throw new AppError(
                status.BAD_REQUEST,
                'Student ID already exists'
            );
        }
    }

    const result = await prisma.student.update({
        where: { id },
        data: payload,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    isActive: true,
                }
            }
        }
    });

    return result;
};

const deleteStudent = async (id: string) => {
    const student = await prisma.student.findUnique({
        where: { id },
    });

    if (!student) {
        throw new AppError(status.NOT_FOUND, 'Student not found');
    }

    const result = await prisma.$transaction(async (tx) => {
        const deletedStudent = await tx.student.delete({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        await tx.user.delete({
            where: { id: student.userId }
        });

        return deletedStudent;
    });

    return result;
};

export const StudentService = {
    getMyProfile,
    updateMyProfile,
    getAllStudents,
    updateStudent,
    deleteStudent,
};