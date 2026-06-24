import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { TMedicine, TMedicineStockUpdate } from './medicine.interface';
import { paginationHelper } from '../../sharedFile/paginationHelper';
import { Prisma } from '../../generated/client';
import { NotificationType } from '../../generated/enums';
import { MedicineSearchableFields } from './medicine.constant';

// const createMedicine = async (payload: TMedicine) => {

//     if (payload.minimumStock >= payload.stockQuantity) {
//         throw new AppError(
//             status.BAD_REQUEST,
//             'Minimum stock cannot be greater than or equal to stock quantity'
//         );
//     }

//     if (
//         payload.expiryDate &&
//         new Date(payload.expiryDate) <= new Date()
//     ) {
//         throw new AppError(
//             status.BAD_REQUEST,
//             'Expiry date must be in the future'
//         );
//     }

//     const result = await prisma.medicine.create({
//         data: payload,
//     });

//     return result;
// };
const createMedicine = async (payload: TMedicine) => {
  payload.dosageForm = payload.dosageForm?.trim().toLowerCase();
  payload.strength = payload.strength?.trim().toLowerCase();
  payload.name = payload.name?.trim();

  if (payload.minimumStock > payload.stockQuantity) {
    throw new AppError(
      status.BAD_REQUEST,
      'Minimum stock cannot be greater than stock quantity'
    );
  }

  if (
    payload.expiryDate &&
    new Date(payload.expiryDate) <= new Date()
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      'Expiry date must be in the future'
    );
  }

  const existingMedicine = await prisma.medicine.findFirst({
    where: {
      name: payload.name,
      strength: payload.strength,
      dosageForm: payload.dosageForm,
    },
  });

  if (existingMedicine) {
    return await prisma.medicine.update({
      where: {
        id: existingMedicine.id,
      },
      data: {
        stockQuantity: {
          increment: payload.stockQuantity,
        },
        unitPrice: payload.unitPrice,
        expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
      },
    });
  }

  return await prisma.medicine.create({
    data: {
      ...payload,
      expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
    },
  });
};

const getAllMedicines = async (filters: any, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions: Prisma.MedicineWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: MedicineSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.MedicineWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.medicine.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.medicine.count({ where: whereConditions });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getSingleMedicine = async (id: string) => {
    const result = await prisma.medicine.findUnique({
        where: { id },
    });

    if (!result) {
        throw new AppError(
            status.NOT_FOUND,
            'Medicine not found'
        );
    }

    return result;
};

const updateMedicine = async (
    id: string,
    payload: Partial<TMedicine>
) => {

    const medicine = await prisma.medicine.findUnique({
        where: { id },
    });

    if (!medicine) {
        throw new AppError(
            status.NOT_FOUND,
            'Medicine not found'
        );
    }

    const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.medicine.update({
            where: { id },
            data: {
                ...payload,
                expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : payload.expiryDate,
            },
        });

        await checkLowStockAndNotify(tx, id);

        return updated;
    });

    return result;
};


const deleteMedicine = async (id: string) => {

    const medicine = await prisma.medicine.findUnique({
        where: { id },
    });

    if (!medicine) {
        throw new AppError(
            status.NOT_FOUND,
            'Medicine not found'
        );
    }

    const result = await prisma.medicine.delete({
        where: { id },
    });
    return result;
};

const checkLowStockAndNotify = async (
    tx: Prisma.TransactionClient,
    medicineId: string
) => {

    const medicine = await tx.medicine.findUnique({
        where: { id: medicineId },
    });

    if (!medicine) return;

    if (medicine.stockQuantity > medicine.minimumStock) return;

    const admin = await tx.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true },
    });

    if (!admin) return;

    const isOutOfStock = medicine.stockQuantity === 0;
    const type = isOutOfStock
        ? NotificationType.OUT_OF_STOCK
        : NotificationType.MEDICINE_LOW_STOCK;

    const existing = await tx.notification.findFirst({
        where: {
            medicineId: medicine.id,
            type,
            isRead: false,
        },
    });

    if (existing) return;

    await tx.notification.create({
        data: {
            title: isOutOfStock
                ? 'Out of Stock Alert'
                : 'Low Stock Alert',

            message: isOutOfStock
                ? `${medicine.name} is completely out of stock.`
                : `${medicine.name} is low in stock (${medicine.stockQuantity} remaining).`,

            type,

            userId: admin.id,
            medicineId: medicine.id,
        },
    });
};

const increaseStock = async (
    id: string,
    payload: TMedicineStockUpdate,
    existingTx?: Prisma.TransactionClient
) => {

    const operation = async (tx: Prisma.TransactionClient) => {

        const updatedMedicine = await tx.medicine.update({
            where: { id },
            data: {
                stockQuantity: {
                    increment: payload.quantity,
                },
            },
        });

        return updatedMedicine;
    };

    if (existingTx) {
        return await operation(existingTx);
    }

    return await prisma.$transaction(operation);
};

const decreaseStock = async (
    id: string,
    payload: TMedicineStockUpdate,
    existingTx?: Prisma.TransactionClient
) => {

    const operation = async (tx: Prisma.TransactionClient) => {

        const updatedMedicine = await tx.medicine.update({
            where: {
                id,
                stockQuantity: {
                    gte: payload.quantity,
                },
            },
            data: {
                stockQuantity: {
                    decrement: payload.quantity,
                },
            },
        });

        if (!updatedMedicine) {
            throw new AppError(
                status.BAD_REQUEST,
                `Requested quantity exceeds available stock`
            );
        }

        await checkLowStockAndNotify(tx, id);

        return updatedMedicine;
    };

    if (existingTx) {
        return await operation(existingTx);
    }

    return await prisma.$transaction(operation);
};

const validateStockAvailability = async (
    id: string,
    quantity: number
) => {

    const medicine = await prisma.medicine.findUnique({
        where: { id },
    });

    if (!medicine) {
        throw new AppError(
            status.NOT_FOUND,
            'Medicine not found'
        );
    }

    if (medicine.stockQuantity < quantity) {
        throw new AppError(
            status.BAD_REQUEST,
            `Requested quantity exceeds available stock (${medicine.stockQuantity} remaining)`
        );
    }
};

const notifyAllLowStockMedicines = async () => {
    const allMedicines = await prisma.medicine.findMany();
    const lowStockMedicines = allMedicines.filter(
        (med) => med.stockQuantity <= med.minimumStock
    );

    if (lowStockMedicines.length === 0) return;

    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true },
    });

    if (!admin) return;

    for (const med of lowStockMedicines) {
        const isOutOfStock = med.stockQuantity === 0;
        const type = isOutOfStock
            ? NotificationType.OUT_OF_STOCK
            : NotificationType.MEDICINE_LOW_STOCK;

        const existing = await prisma.notification.findFirst({
            where: {
                medicineId: med.id,
                type,
                isRead: false,
            },
        });

        if (existing) continue;

        await prisma.notification.create({
            data: {
                title: isOutOfStock
                    ? 'Out of Stock Alert'
                    : 'Low Stock Alert',
                message: isOutOfStock
                    ? `${med.name} is completely out of stock.`
                    : `${med.name} is low in stock (${med.stockQuantity} remaining).`,
                type,
                userId: admin.id,
                medicineId: med.id,
            },
        });
    }
};

export const MedicineService = {
    createMedicine,
    getAllMedicines,
    getSingleMedicine,
    updateMedicine,
    deleteMedicine,
    increaseStock,
    decreaseStock,
    validateStockAvailability,
    notifyAllLowStockMedicines,
};