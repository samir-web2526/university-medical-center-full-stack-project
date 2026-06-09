import { z } from 'zod';

const createMedicineValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    dosageForm: z.string(),
    strength: z.string(),
    genericName: z.string().optional(),
    manufacturer: z.string().optional(),
    stockQuantity: z.number().min(0),
    minimumStock: z.number().min(0),
    expiryDate: z.string().datetime().optional(),
    unitPrice: z.number().min(0).optional(),
  }).strict(),
});

const updateMedicineValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    dosageForm: z.string().optional(),
    strength: z.string().optional(),
    genericName: z.string().optional(),
    manufacturer: z.string().optional(),
    stockQuantity: z.number().min(0).optional(),
    minimumStock: z.number().min(0).optional(),
    expiryDate: z.string().optional(),
    unitPrice: z.number().optional()
  }).strict()
});

const updateStockValidationSchema = z.object({
  body: z.object({
    quantity: z.number().min(1)
  }).strict()
});

export const MedicineValidation = {
  createMedicineValidationSchema,
  updateMedicineValidationSchema,
  updateStockValidationSchema
};