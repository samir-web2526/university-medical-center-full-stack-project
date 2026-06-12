// ─────────────────────────────────────────────
// Medicine Model
// ─────────────────────────────────────────────

export interface Medicine {
  id: string;
  name: string;
  description: string | null;
  genericName: string | null;
  manufacturer: string | null;
  dosageForm: string | null;
  strength: string | null;
  expiryDate: string | null;
  unitPrice: number | null;
  stockQuantity: number;
  minimumStock: number;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Medicine Request DTOs
// ─────────────────────────────────────────────

export interface CreateMedicineRequest {
  name: string;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
  expiryDate?: string;
  unitPrice?: number;
  stockQuantity: number;
  minimumStock: number;
}

export interface UpdateMedicineRequest {
  name?: string;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
  expiryDate?: string;
  unitPrice?: number;
  minimumStock?: number;
}

export interface AdjustStockRequest {
  quantity: number;
}
