export type TPrescriptionMedicine = {
    prescriptionId: string;
    medicineId: string;
    dosage: string;
    duration: string;
    quantity?: number;
    instructions?: string;
};