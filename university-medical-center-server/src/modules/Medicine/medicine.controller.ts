import { Request, Response } from 'express';
import catchAsync from '../../sharedFile/catchAsync';
import sendResponse from '../../sharedFile/sendResponse';
import status from 'http-status';
import pick from '../../sharedFile/pick';
import { MedicineService } from './medicine.service';
import { MedicineSearchableFields } from './medicine.constant';

const createMedicine = catchAsync(async (req: Request, res: Response) => {
    const result = await MedicineService.createMedicine(req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Medicine created successfully',
        data: result,
    });
});

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerm', ...MedicineSearchableFields]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await MedicineService.getAllMedicines(filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Medicines retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getSingleMedicine = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await MedicineService.getSingleMedicine(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Medicine retrieved successfully',
        data: result,
    });
});

const updateMedicine = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await MedicineService.updateMedicine(id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Medicine updated successfully',
        data: result,
    });
});

const deleteMedicine = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await MedicineService.deleteMedicine(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Medicine deleted successfully',
        data: result,
    });
});

const increaseStock = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await MedicineService.increaseStock(id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Stock increased successfully',
        data: result,
    });
});

const decreaseStock = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await MedicineService.decreaseStock(id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Stock decreased successfully',
        data: result,
    });
});

export const MedicineController = {
    createMedicine,
    getAllMedicines,
    getSingleMedicine,
    updateMedicine,
    deleteMedicine,
    increaseStock,
    decreaseStock
};