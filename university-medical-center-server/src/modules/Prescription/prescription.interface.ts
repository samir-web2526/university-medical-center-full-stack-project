export interface IMedicineInput {
    medicineId: string;
    dosage: string;
    frequency?: string;
    duration: string;
    quantity?: number;
    instructions?: string;
}

export interface IPrescriptionCreate {
    visitId: string;
    diagnosis: string;
    advice?: string;
    investigation?: string;
    prescriptionImage?: string;
    medicines: IMedicineInput[];
}