import { z } from 'zod';

const createVisitSchema = z.object({
    body: z.object({
        studentId: z.string().nonempty(),
        chiefComplaint: z.string().nonempty(),
        bloodPressure: z.string().optional(),
        temperature: z.number().optional(),
        weight: z.number().optional(),
        pulseRate: z.number().int().optional(),
        notes: z.string().optional(),
    }).strict()
});

const updateVisitSchema = z.object({
    body: z.object({
        chiefComplaint: z.string().optional(),
        bloodPressure: z.string().optional(),
        temperature: z.number().optional(),
        weight: z.number().optional(),
        pulseRate: z.number().int().optional(),
        notes: z.string().optional(),
    }).strict(),
});

export const VisitValidation = {
    createVisitSchema,
    updateVisitSchema
};