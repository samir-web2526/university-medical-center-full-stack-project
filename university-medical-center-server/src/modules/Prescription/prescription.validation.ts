import { z } from 'zod';

const createPrescription = z.object({
    body: z.object({
        visitId: z.string(),
        diagnosis: z.string(),
        advice: z.string().optional(),
        prescriptionImage: z.string().url().optional(),
        medicines: z.array(
            z.object({
                medicineId: z.string(),
                dosage: z.string(),
                duration: z.string(),
                instructions: z.string().optional(),
            })
        ).min(1)
    }).strict(),
});

export const PrescriptionValidation = {
    createPrescription,
};