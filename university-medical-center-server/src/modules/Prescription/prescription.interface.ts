export interface IMedicineInput {
    medicineId: string;
    dosage: string;
    duration: string;
    quantity?: number;
    instructions?: string;
}

export interface IPrescriptionCreate {
    visitId: string;
    diagnosis: string;
    advice?: string;
    prescriptionImage?: string;
    medicines: IMedicineInput[];
}