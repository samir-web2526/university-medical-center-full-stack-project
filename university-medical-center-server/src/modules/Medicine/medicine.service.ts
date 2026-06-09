import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { TMedicine, TMedicineStockUpdate } from './medicine.interface';
import { paginationHelper } from '../../sharedFile/paginationHelper';
import { Prisma } from '../../generated/client';
import { NotificationType } from '../../generated/enums';
import { MedicineSearchableFields } from './medicine.constant';

const createMedicine = async (payload: TMedicine) => {

    if (payload.minimumStock >= payload.stockQuantity) {
        throw new AppError(
            status.BAD_REQUEST,
            'Minimum stock cannot be greater than or equal to stock quantity'
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

    const result = await prisma.medicine.create({
        data: payload,
    });

    return result;
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

    return await prisma.medicine.update({
        where: { id },
        data: payload,
    });
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

    const isOutOfStock = medicine.stockQuantity === 0;

    const admin = await tx.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true },
    });

    if (!admin) return;

    await tx.notification.create({
        data: {
            title: isOutOfStock
                ? 'Out of Stock Alert'
                : 'Low Stock Alert',

            message: isOutOfStock
                ? `${medicine.name} is completely out of stock.`
                : `${medicine.name} is low in stock (${medicine.stockQuantity} remaining).`,

            type: isOutOfStock
                ? NotificationType.OUT_OF_STOCK
                : NotificationType.MEDICINE_LOW_STOCK,

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

export const MedicineService = {
    createMedicine,
    getAllMedicines,
    getSingleMedicine,
    updateMedicine,
    deleteMedicine,
    increaseStock,
    decreaseStock,
    validateStockAvailability
};