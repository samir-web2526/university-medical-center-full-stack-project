export interface IMedicineInput {
    medicineId: string;
    dosage: string;
    duration: string;
    instructions?: string;
}

export interface IPrescriptionCreate {
    visitId: string;
    studentId: string;
    diagnosis: string;
    advice?: string;
    medicines: IMedicineInput[];
}