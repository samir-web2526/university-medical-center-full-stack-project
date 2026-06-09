import { z } from 'zod';

const createValidation = z.object({
    body: z.object({
        prescriptionId: z.string().nonempty('Prescription ID is required'),
        medicineId: z.string().nonempty('Medicine ID is required'),
        dosage: z.string().nonempty('Dosage is required'),
        duration: z.string().nonempty('Duration is required'),
        quantity: z.number().optional(),
        instructions: z.string().optional(),
    }),
});

const updateValidation = z.object({
    body: z.object({
        dosage: z.string().optional(),
        duration: z.string().optional(),
        quantity: z.number().optional(),
        instructions: z.string().optional(),
    }),
});

export const prescriptionMedicineValidationSchema = {
    createValidation,
    updateValidation,
};