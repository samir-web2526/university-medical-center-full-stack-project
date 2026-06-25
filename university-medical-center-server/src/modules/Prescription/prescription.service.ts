import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { IPrescriptionCreate } from './prescription.interface';
import { paginationHelper } from '../../sharedFile/paginationHelper';
import { Prisma } from '../../generated/client';
import { MedicineService } from '../Medicine/medicine.service';
import { NotificationService } from '../Notification/notification.service';
import { NotificationType } from '../../generated/enums';

const createPrescription = async (
    userId: string,
    payload: IPrescriptionCreate
) => {

    const doctor = await prisma.doctor.findUnique({
        where: { userId },
    });

    if (!doctor) {
        throw new AppError(status.NOT_FOUND, 'Doctor not found');
    }

    const visit = await prisma.visit.findUnique({
        where: { id: payload.visitId },
    });

    if (!visit) {
        throw new AppError(status.NOT_FOUND, 'Visit not found');
    }

    if (visit.doctorId !== doctor.id) {
        throw new AppError(
            status.FORBIDDEN,
            'You can only prescribe for your own visits'
        );
    }

    const result = await prisma.$transaction(async (tx) => {
        const existingPrescription = await tx.prescription.findFirst({
            where: { visitId: visit.id, status: 'ACTIVE' },
        });

        if (existingPrescription) {
            throw new AppError(
                status.BAD_REQUEST,
                'Prescription already exists for this visit'
            );
        }

        const cancelledPrescription = await tx.prescription.findFirst({
            where: { visitId: visit.id, status: 'CANCELLED' },
        });

        if (cancelledPrescription) {
            await tx.prescriptionMedicine.deleteMany({
                where: { prescriptionId: cancelledPrescription.id },
            });
            await tx.prescription.delete({
                where: { id: cancelledPrescription.id },
            });
        }

        const prescription = await tx.prescription.create({
            data: {
                visitId: visit.id,
                studentId: visit.studentId,
                doctorId: doctor.id,
                diagnosis: payload.diagnosis,
                advice: payload.advice,
                investigation: payload.investigation,
                prescriptionImage: payload.prescriptionImage,

                medicines: {
                    create: payload.medicines.map((med) => ({
                        medicineId: med.medicineId,
                        dosage: med.dosage,
                        frequency: med.frequency,
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

        for (const med of payload.medicines) {
            const quantity = med.quantity ?? 1;

            await MedicineService.decreaseStock(
                med.medicineId,
                { quantity },
                tx
            );
        }

        const student = await tx.student.findUnique({
            where: { id: visit.studentId },
        });

        if (student) {
            await NotificationService.createNotification({
                title: 'New Prescription',
                message: 'A new prescription has been added for your visit.',
                type: NotificationType.PRESCRIPTION_CREATED,
                userId: student.userId,
                prescriptionId: prescription.id,
                visitId: visit.id,
            }, tx);
        }

        return prescription;
    });

    return result;
};

const getMyPrescriptionsAsDoctor = async (
    userId: string,
    filters: any,
    options: any
) => {

    const { limit, page, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const doctor = await prisma.doctor.findUnique({
        where: { userId },
    });

    if (!doctor) {
        throw new AppError(status.NOT_FOUND, 'Doctor not found');
    }

    const { searchTerm } = filters;

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
                    studentId: searchTerm,
                },
            ],
        });
    }

    andConditions.push({
        doctorId: doctor.id,
    });

    const whereConditions: Prisma.PrescriptionWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.prescription.findMany({
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
                            strength: true,
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
            [sortBy]: sortOrder,
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
            [sortBy]: sortOrder,
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

const cancelPrescription = async (
    prescriptionId: string,
    cancelReason: string
) => {

    const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: { student: true }
    });

    if (!prescription) {
        throw new AppError(status.NOT_FOUND, 'Prescription not found');
    }

    if (prescription.status === 'CANCELLED') {
        throw new AppError(
            status.BAD_REQUEST,
            'Prescription already cancelled'
        );
    }

    const result = await prisma.prescription.update({
        where: { id: prescriptionId },
        data: {
            status: 'CANCELLED',
            cancelReason,
            cancelledAt: new Date(),
        },
    });

    await NotificationService.createNotification({
        title: 'Prescription Cancelled',
        message: `Your prescription has been cancelled. Reason: ${cancelReason}`,
        type: NotificationType.PRESCRIPTION_CANCELLED,
        userId: prescription.student.userId,
        prescriptionId: prescription.id,
    });

    return result;
};

export const PrescriptionService = {
    createPrescription,
    getAllPrescriptions,
    getMyPrescriptionsAsDoctor,
    getMyPrescriptionsAsPatient,
    getPrescriptionById,
    cancelPrescription,
};