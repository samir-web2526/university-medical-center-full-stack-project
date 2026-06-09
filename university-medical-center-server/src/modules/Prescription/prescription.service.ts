import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { IPrescriptionCreate } from './prescription.interface';
import { paginationHelper } from '../../sharedFile/paginationHelper';
import { Prisma } from '../../generated/client';
import { MedicineService } from '../Medicine/medicine.service';

const createPrescription = async (
    userId: string,
    payload: IPrescriptionCreate
) => {

    const doctor = await prisma.doctor.findUnique({
        where: { userId }
    });

    if (!doctor) {
        throw new AppError(
            status.NOT_FOUND,
            'Doctor not found'
        );
    }

    const visit = await prisma.visit.findUnique({
        where: { id: payload.visitId }
    });

    if (!visit) {
        throw new AppError(
            status.NOT_FOUND,
            'Visit not found'
        );
    }

    if (visit.doctorId !== doctor.id) {
        throw new AppError(
            status.FORBIDDEN,
            'You can only prescribe for your own visits'
        );
    }

    const result = await prisma.$transaction(async (tx) => {

        const prescription = await tx.prescription.create({
            data: {
                visitId: visit.id,
                studentId: visit.studentId,
                doctorId: doctor.id,
                diagnosis: payload.diagnosis,
                advice: payload.advice,
                prescriptionImage: payload.prescriptionImage,

                medicines: {
                    create: payload.medicines.map((med) => ({
                        medicineId: med.medicineId,
                        dosage: med.dosage,
                        duration: med.duration,
                        quantity: med.quantity ?? 1,
                        instructions: med.instructions,
                    })),
                },
            },
            include: {
                medicines: true,
                visit: true,
            },
        });

        // Update Medicine Stock via Medicine module
        for (const med of payload.medicines) {
            const quantity = med.quantity ?? 1;
            await MedicineService.decreaseStock(med.medicineId, { quantity }, tx);
        }

        return prescription;
    });

    return result;
};

const getAllPrescriptions = async (
    filters: any,
    options: any
) => {

    const {
        limit,
        page,
        skip,
        sortBy,
        sortOrder,
    } = paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.PrescriptionWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    student: {
                        user: {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    },
                },
                {
                    doctor: {
                        user: {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    },
                },
            ],
        });
    }

    // FILTERS
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.PrescriptionWhereInput =
        andConditions.length > 0
            ? { AND: andConditions }
            : {};

    const result = await prisma.prescription.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy || 'createdAt']: sortOrder || 'desc',
        },

        include: {
            visit: true,

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
                        },
                    },
                },
            },

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
                        },
                    },
                },
            },

            medicines: {
                include: {
                    medicine: true,
                },
            },
        },
    });

    const total = await prisma.prescription.count({
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

const getMyPrescriptionsAsDoctor = async (
    userId: string,
    options: any
) => {

    const {
        limit,
        page,
        skip,
        sortBy,
        sortOrder,
    } = paginationHelper.calculatePagination(options);

    const doctor = await prisma.doctor.findUnique({
        where: { userId },
    });

    if (!doctor) {
        throw new AppError(
            status.NOT_FOUND,
            'Doctor not found'
        );
    }

    const result = await prisma.prescription.findMany({
        where: {
            doctorId: doctor.id,
        },

        skip,
        take: limit,
        orderBy: {
            [sortBy || 'createdAt']: sortOrder || 'desc',
        },

        include: {
            student: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },

            medicines: {
                include: {
                    medicine: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },

            visit: {
                select: {
                    id: true,
                    visitDate: true,
                },
            },
        },
    });

    const total = await prisma.prescription.count({
        where: {
            doctorId: doctor.id,
        },
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

const getMyPrescriptionsAsPatient = async (
    userId: string,
    options: any
) => {

    const {
        limit,
        page,
        skip,
        sortBy,
        sortOrder,
    } = paginationHelper.calculatePagination(options);

    const student = await prisma.student.findUnique({
        where: { userId },
    });

    if (!student) {
        throw new AppError(
            status.NOT_FOUND,
            'Student not found'
        );
    }

    const result = await prisma.prescription.findMany({
        where: {
            studentId: student.id,
        },

        skip,
        take: limit,

        orderBy: {
            [sortBy || 'createdAt']: sortOrder || 'desc',
        },

        include: {
            doctor: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },

            medicines: {
                include: {
                    medicine: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },

            visit: {
                select: {
                    id: true,
                    visitDate: true,
                },
            },
        },
    });

    const total = await prisma.prescription.count({
        where: {
            studentId: student.id,
        },
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

const getPrescriptionById = async (
    userId: string,
    userRole: string,
    prescriptionId: string
) => {

    const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },

        include: {
            doctor: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },

            student: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },

            visit: true,

            medicines: {
                include: {
                    medicine: {
                        select: {
                            id: true,
                            name: true,
                            genericName: true,
                        },
                    },
                },
            },
        },
    });

    if (!prescription) {
        throw new AppError(
            status.NOT_FOUND,
            'Prescription not found'
        );
    }

    // ---------------------------
    // RBAC (clean & safe)
    // ---------------------------

    if (userRole === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({
            where: { userId },
        });

        if (doctor?.id !== prescription.doctorId) {
            throw new AppError(
                status.FORBIDDEN,
                'Access denied'
            );
        }
    }

    if (userRole === 'STUDENT') {
        const student = await prisma.student.findUnique({
            where: { userId },
        });

        if (student?.id !== prescription.studentId) {
            throw new AppError(
                status.FORBIDDEN,
                'Access denied'
            );
        }
    }

    return prescription;
};

export const PrescriptionService = {
    createPrescription,
    getAllPrescriptions,
    getMyPrescriptionsAsDoctor,
    getMyPrescriptionsAsPatient,
    getPrescriptionById,
};