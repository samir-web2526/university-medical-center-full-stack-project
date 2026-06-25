import { z } from 'zod';

const createVisitSchema = z.object({
    body: z.object({
        studentId: z.string({ message: 'Student ID is required' }).trim().min(1, 'Student ID is required'),
        chiefComplaint: z.string({ message: 'Chief complaint is required' }).trim().min(1, 'Chief complaint is required'),
        bloodPressure: z.string().trim().regex(/^\d{1,3}\s*\/\s*\d{1,3}(\s*(mmHg|mmhg|MMHG))?$/, 'Blood pressure format: 120/80 or 120/80 mmHg').optional(),
        temperature: z.number({ message: 'Temperature must be a number' }).min(90, 'Temperature must be at least 90°F').max(110, 'Temperature must be at most 110°F').optional(),
        weight: z.number({ message: 'Weight must be a number' }).min(1, 'Weight must be at least 1 kg').max(500, 'Weight must be at most 500 kg').optional(),
        pulseRate: z.number({ message: 'Pulse rate must be a number' }).int('Pulse rate must be a whole number').min(20, 'Pulse rate must be at least 20 bpm').max(300, 'Pulse rate must be at most 300 bpm').optional(),
        notes: z.string().optional(),
        visitDate: z.string().optional(),
    }).strict()
});

const updateVisitSchema = z.object({
    body: z.object({
        chiefComplaint: z.string().trim().min(1, 'Chief complaint cannot be empty').optional(),
        bloodPressure: z.string().trim().regex(/^\d{1,3}\s*\/\s*\d{1,3}(\s*(mmHg|mmhg|MMHG))?$/, 'Blood pressure format: 120/80 or 120/80 mmHg').optional(),
        temperature: z.number({ message: 'Temperature must be a number' }).min(90, 'Temperature must be at least 90°F').max(110, 'Temperature must be at most 110°F').optional(),
        weight: z.number({ message: 'Weight must be a number' }).min(1, 'Weight must be at least 1 kg').max(500, 'Weight must be at most 500 kg').optional(),
        pulseRate: z.number({ message: 'Pulse rate must be a number' }).int('Pulse rate must be a whole number').min(20, 'Pulse rate must be at least 20 bpm').max(300, 'Pulse rate must be at most 300 bpm').optional(),
        notes: z.string().optional(),
    }).strict(),
});

export const VisitValidation = {
    createVisitSchema,
    updateVisitSchema
};