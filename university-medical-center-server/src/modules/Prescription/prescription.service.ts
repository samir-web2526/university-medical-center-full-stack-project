import { Prisma } from '../../generated/client';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { IPrescriptionCreate } from './prescription.interface';
import { paginationHelper } from '../../sharedFile/paginationHelper';

const createPrescription = async (userId: string, payload: IPrescriptionCreate) => {
    // Resolve doctor
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new AppError(status.NOT_FOUND, 'Doctor not found');

    // Ensure the visit belongs to this doctor
    const visit = await prisma.visit.findUnique({ where: { id: payload.visitId } });
    if (!visit) throw new AppError(status.NOT_FOUND, 'Visit not found');
    if (visit.doctorId !== doctor.id) throw new AppError(status.FORBIDDEN, 'You can only prescribe for your own visits');

    // Create using nested writes
    const result = await prisma.$transaction(async (tx) => {
        const prescription = await tx.prescription.create({
            data: {
                visitId: payload.visitId,
                studentId: payload.studentId,
                doctorId: doctor.id,
                diagnosis: payload.diagnosis,
                advice: payload.advice,
                medicines: {
                    create: payload.medicines.map((med) => ({
                        medicineId: med.medicineId,
                        dosage: med.dosage,
                        duration: med.duration,
                        instructions: med.instructions,
                    })),
                },
            },
            include: {
                medicines: true,
            },
        });

        return prescription;
    });

    return result;
};

const getAllPrescriptions = async (options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.prescription.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
            doctor: { include: { user: { select: { name: true } } } },
            student: { include: { user: { select: { name: true } } } },
            medicines: true,
        },
    });

    const total = await prisma.prescription.count();

    const flattenedData = result.map((p) => ({
        id: p.id,
        createdAt: p.createdAt,
        diagnosis: p.diagnosis,
        doctorName: p.doctor.user.name,
        patientName: p.student.user.name,
        medicineCount: p.medicines.length,
    }));

    return {
        meta: { total, page, limit },
        data: flattenedData,
    };
};

const getMyPrescriptionsAsDoctor = async (userId: string, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new AppError(status.NOT_FOUND, 'Doctor not found');

    const result = await prisma.prescription.findMany({
        where: { doctorId: doctor.id },
        skip,
        take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
            student: { include: { user: { select: { name: true } } } },
            medicines: true,
        },
    });

    const total = await prisma.prescription.count({ where: { doctorId: doctor.id } });

    const flattenedData = result.map((p) => ({
        id: p.id,
        createdAt: p.createdAt,
        diagnosis: p.diagnosis,
        patientName: p.student.user.name,
        medicineCount: p.medicines.length,
    }));

    return {
        meta: { total, page, limit },
        data: flattenedData,
    };
};

const getMyPrescriptionsAsPatient = async (userId: string, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new AppError(status.NOT_FOUND, 'Student not found');

    const result = await prisma.prescription.findMany({
        where: { studentId: student.id },
        skip,
        take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
            doctor: { include: { user: { select: { name: true } } } },
            medicines: true,
        },
    });

    const total = await prisma.prescription.count({ where: { studentId: student.id } });

    const flattenedData = result.map((p) => ({
        id: p.id,
        createdAt: p.createdAt,
        diagnosis: p.diagnosis,
        doctorName: p.doctor.user.name,
        medicineCount: p.medicines.length,
    }));

    return {
        meta: { total, page, limit },
        data: flattenedData,
    };
};

const getPrescriptionById = async (userId: string, userRole: string, prescriptionId: string) => {
    const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
            doctor: { include: { user: { select: { name: true } } } },
            student: { include: { user: { select: { name: true, email: true, phone: true } } } },
            visit: true,
            medicines: {
                include: {
                    medicine: { select: { name: true, genericName: true } }
                }
            }
        }
    });

    if (!prescription) throw new AppError(status.NOT_FOUND, 'Prescription not found');

    // RBAC validation
    if (userRole === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({ where: { userId } });
        if (doctor && prescription.doctorId !== doctor.id) {
            throw new AppError(status.FORBIDDEN, 'You do not have access to this prescription');
        }
    } else if (userRole === 'STUDENT') {
        const student = await prisma.student.findUnique({ where: { userId } });
        if (student && prescription.studentId !== student.id) {
            throw new AppError(status.FORBIDDEN, 'You do not have access to this prescription');
        }
    }

    // Flatten nested medicines for frontend
    const mappedMedicines = prescription.medicines.map((m) => ({
        id: m.id,
        medicineName: m.medicine.name,
        genericName: m.medicine.genericName,
        dosage: m.dosage,
        duration: m.duration,
        instructions: m.instructions,
    }));

    return {
        id: prescription.id,
        visitDate: prescription.visit.visitDate,
        createdAt: prescription.createdAt,
        diagnosis: prescription.diagnosis,
        advice: prescription.advice,
        doctorName: prescription.doctor.user.name,
        patient: {
            name: prescription.student.user.name,
            email: prescription.student.user.email,
            phone: prescription.student.user.phone,
        },
        medicines: mappedMedicines,
    };
};

export const PrescriptionService = {
    createPrescription,
    getAllPrescriptions,
    getMyPrescriptionsAsDoctor,
    getMyPrescriptionsAsPatient,
    getPrescriptionById,
};