import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import status from "http-status";
import { TPrescriptionMedicine } from "./prescriptionMedicine.interface";
import { MedicineService } from "../Medicine/medicine.service";

const addMedicineToPrescription = async (payload: TPrescriptionMedicine) => {
    // Validate prescription exists
    const prescription = await prisma.prescription.findUnique({
        where: { id: payload.prescriptionId },
    });

    if (!prescription) {
        throw new AppError(status.NOT_FOUND, 'Prescription not found');
    }

    // Validate medicine exists
    const medicine = await prisma.medicine.findUnique({
        where: { id: payload.medicineId },
    });

    if (!medicine) {
        throw new AppError(status.NOT_FOUND, 'Medicine not found');
    }

    const quantity = payload.quantity ?? 1;

    // decrease stock using MedicineService
    await MedicineService.decreaseStock(payload.medicineId, { quantity });

    // Create prescription medicine record
    const result = await prisma.prescriptionMedicine.create({
        data: {
            ...payload,
            quantity,
        },
    });

    return result;
};

const updatePrescriptionMedicine = async (id: string, payload: Partial<TPrescriptionMedicine>) => {
    const existingRecord = await prisma.prescriptionMedicine.findUnique({
        where: { id },
    });

    if (!existingRecord) {
        throw new AppError(status.NOT_FOUND, 'Prescription medicine record not found');
    }

    // if quantity changes, we need to adjust stock
    if (payload.quantity && payload.quantity !== existingRecord.quantity) {
        const difference = payload.quantity - (existingRecord.quantity ?? 1);
        if (difference > 0) {
            await MedicineService.decreaseStock(existingRecord.medicineId, { quantity: difference });
        } else {
            await MedicineService.increaseStock(existingRecord.medicineId, { quantity: Math.abs(difference) });
        }
    }

    const result = await prisma.prescriptionMedicine.update({
        where: { id },
        data: payload,
    });

    return result;
};

const removePrescriptionMedicine = async (id: string) => {
    const existingRecord = await prisma.prescriptionMedicine.findUnique({
        where: { id },
    });

    if (!existingRecord) {
        throw new AppError(status.NOT_FOUND, 'Prescription medicine record not found');
    }

    // increase stock back
    await MedicineService.increaseStock(existingRecord.medicineId, { quantity: existingRecord.quantity ?? 1 });

    const result = await prisma.prescriptionMedicine.delete({
        where: { id },
    });

    return result;
};

const getPrescriptionMedicinesByPrescriptionId = async (prescriptionId: string) => {
    // Validate prescription exists
    const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
    });

    if (!prescription) {
        throw new AppError(status.NOT_FOUND, 'Prescription not found');
    }

    const result = await prisma.prescriptionMedicine.findMany({
        where: { prescriptionId },
        include: {
            medicine: true,
        },
    });

    return result;
};

export const PrescriptionMedicineService = {
    addMedicineToPrescription,
    updatePrescriptionMedicine,
    removePrescriptionMedicine,
    getPrescriptionMedicinesByPrescriptionId,
};