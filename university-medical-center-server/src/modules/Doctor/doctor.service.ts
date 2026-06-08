import { Prisma } from "../../generated/client";
import { prisma } from "../../lib/prisma";
import { paginationHelper } from '../../sharedFile/paginationHelper';
import { doctorSearchableFields } from './doctor.constant';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { IDoctorFilters, IDoctorUpdate } from './doctor.interface';


const getMyProfile = async (userId: string) => {
    const result = await prisma.doctor.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    isActive: true,
                }
            }
        }
    });

    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Doctor not found');
    }

    return result;
};

const updateMyProfile = async (userId: string, payload: IDoctorUpdate) => {
    const doctor = await prisma.doctor.findUnique({
        where: { userId },
    });

    if (!doctor) {
        throw new AppError(status.NOT_FOUND, 'Doctor not found');
    }

    const result = await prisma.doctor.update({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    isActive: true,
                }
            }
        },
        data: payload,
    });

    return result;
};

const getAllDoctors = async (
    filters: IDoctorFilters,
    options: any
) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (key === 'name' || key === 'email') {
                    return {
                        user: {
                            [key]: {
                                equals: (filterData as any)[key],
                            },
                        },
                    };
                }
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
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
                    role: true,
                    status: true,
                    isActive: true,
                }
            }
        }
    });

    const total = await prisma.doctor.count({
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

const getSingleDoctor = async (id: string) => {
    const result = await prisma.doctor.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    isActive: true,
                }
            }
        }
    });

    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Doctor not found');
    }

    return result;
};

const updateDoctor = async (id: string, payload: IDoctorUpdate) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id },
    });

    if (!doctor) {
        throw new AppError(status.NOT_FOUND, 'Doctor not found');
    }

    const result = await prisma.doctor.update({
        where: { id },
        data: payload,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    isActive: true,
                },
            },
        },
    });

    return result;
};

const deleteDoctor = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id },
    });

    if (!doctor) {
        throw new AppError(status.NOT_FOUND, 'Doctor not found');
    }

    const result = await prisma.$transaction(async (tx) => {
        const deletedDoctor = await tx.doctor.delete({
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
            where: { id: doctor.userId }
        });

        return deletedDoctor;
    });

    return result;
};

export const DoctorService = {
    getMyProfile,
    updateMyProfile,
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
};