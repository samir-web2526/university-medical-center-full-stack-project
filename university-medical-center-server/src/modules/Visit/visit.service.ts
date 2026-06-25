
import { prisma } from "../../lib/prisma";
import { paginationHelper } from "../../sharedFile/paginationHelper";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status";
import { Prisma } from "../../generated/client";
import { VisitFilterableFields } from "./visit.constant";


const createVisit = async (userId: string, payload: any) => {

    const student = await prisma.student.findFirst({
        where: { studentId: payload.studentId }
    });

    if (!student) {
        throw new AppError(404, "Student not found");
    }

    const doctor = await prisma.doctor.findUnique({
        where: { userId }
    });

    if (!doctor) {
        throw new AppError(404, "Doctor not found");
    }

    const visit = await prisma.visit.create({
        data: {
            studentId: student.id,
            doctorId: doctor.id,

            chiefComplaint: payload.chiefComplaint,
            bloodPressure: payload.bloodPressure,
            temperature: payload.temperature,
            weight: payload.weight,
            pulseRate: payload.pulseRate,
            notes: payload.notes,

            visitDate: payload.visitDate ? new Date(payload.visitDate) : new Date(),
        },
        include: {
            student: {
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
            },
            doctor: {
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
            }
        }
    });

    return visit;
};

const getVisits = async (
    filters: any,
    options: any,
    authUser: { id: string; role: string }
) => {
    const { page, limit, skip } =
        paginationHelper.calculatePagination(options);

    const andConditions: Prisma.VisitWhereInput[] = [];

    if (authUser.role === 'STUDENT') {
        const student = await prisma.student.findUnique({
            where: { userId: authUser.id },
        });

        if (student) {
            andConditions.push({
                studentId: student.id,
            });
        }
    }

    if (authUser.role === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({
            where: { userId: authUser.id },
        });

        if (doctor) {
            andConditions.push({
                doctorId: doctor.id,
            });
        }
    }

    const VisitFilterableFields = [
        'studentId',
        'doctorId',
        'visitDate',
    ];

    Object.keys(filters).forEach((key) => {
        if (VisitFilterableFields.includes(key)) {
            andConditions.push({
                [key]: filters[key],
            } as Prisma.VisitWhereInput);
        }
    });

    const whereConditions: Prisma.VisitWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const sortBy = 'visitDate';
    const sortOrder = options.sortOrder === 'asc' ? 'asc' : 'desc';

    const result = await prisma.visit.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            student: {
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
            },
            doctor: {
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
            },
        },
    });

    const total = await prisma.visit.count({
        where: whereConditions,
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getVisitById = async (
    id: string,
    authUser: { id: string; role: string }
) => {

    const result = await prisma.visit.findUnique({
        where: { id },
        include: {
            student: {
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
            },
            doctor: {
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
            },
            prescription: {
                include: {
                    medicines: {
                        include: {
                            medicine: true,
                        }
                    }
                }
            }
        }
    });

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Visit not found");
    }

    if (authUser.role === 'STUDENT') {
        const student = await prisma.student.findUnique({
            where: { userId: authUser.id },
        });

        if (!student || result.studentId !== student.id) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not allowed to view this visit"
            );
        }
    }

    if (authUser.role === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({
            where: { userId: authUser.id },
        });

        if (!doctor || result.doctorId !== doctor.id) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not allowed to view this visit"
            );
        }
    }

    return result;
};

const updateVisit = async (id: string, payload: any) => {

    const visit = await prisma.visit.findUnique({
        where: { id },
    });

    if (!visit) {
        throw new AppError(httpStatus.NOT_FOUND, "Visit not found");
    }

    const result = await prisma.visit.update({
        where: { id },
        data: payload,
        include: {
            student: {
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
            },
            doctor: {
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
            },
        },
    });

    return result;
};

const deleteVisit = async (id: string) => {
    const visit = await prisma.visit.findUnique({ where: { id } });
    if (!visit) {
        throw new AppError(httpStatus.NOT_FOUND, "Visit not found");
    }

    const result = await prisma.visit.delete({
        where: { id }
    });
    return result;
};

export const VisitService = {
    createVisit,
    getVisits,
    getVisitById,
    updateVisit,
    deleteVisit,
};