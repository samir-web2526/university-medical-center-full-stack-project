export type TMedicine = {
  name: string;
  description?: string;
  dosageForm: string;
  strength: string;
  genericName?: string;
  manufacturer?: string;
  stockQuantity: number;
  minimumStock: number;
  expiryDate?: Date | string;
  unitPrice?: number;
};

export type TMedicineStockUpdate = {
  quantity: number;
};