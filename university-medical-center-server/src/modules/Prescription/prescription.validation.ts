import { z } from 'zod';

const createPrescription = z.object({
    body: z.object({
        visitId: z.string(),
        studentId: z.string(),
        diagnosis: z.string(),
        advice: z.string().optional(),
        medicines: z.array(
            z.object({
                medicineId: z.string(),
                dosage: z.string(),
                duration: z.string(),
                instructions: z.string().optional(),
            })
        ).min(1, 'At least one medicine is required').nonempty()
    }).strict(),
});

export const PrescriptionValidation = {
    createPrescription,
};