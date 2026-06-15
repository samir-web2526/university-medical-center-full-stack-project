import { z } from 'zod';

const createPrescription = z.object({
    body: z.object({
        visitId: z.string(),
        diagnosis: z.string(),
        advice: z.string().optional(),
        investigation: z.string().optional(),
        prescriptionImage: z.string().url().optional(),
        medicines: z.array(
            z.object({
                medicineId: z.string(),
                dosage: z.string(),
                frequency: z.string().optional(),
                quantity: z.number().min(1),
                duration: z.string(),
                instructions: z.string().optional(),
            })
        ).min(1)
    }).strict(),
});

const cancelPrescription = z.object({
    body: z.object({
        cancelReason: z.string().min(3, 'Reason is required'),
    }),
});

export const PrescriptionValidation = {
    createPrescription,
    cancelPrescription
};