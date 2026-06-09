import { Request, Response } from 'express';
import status from 'http-status';
import { PrescriptionService } from './prescription.service';
import sendResponse from '../../sharedFile/sendResponse';
import pick from '../../sharedFile/pick';
import { catchAsync } from '../../sharedFile';

const createPrescription = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) throw new Error('User ID not found');

    const result = await PrescriptionService.createPrescription(userId, req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Prescription created successfully',
        data: result,
    });
});

const getAllPrescriptions = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PrescriptionService.getAllPrescriptions(options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescriptions fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getMyPrescriptionsAsDoctor = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) throw new Error('User ID not found');

    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PrescriptionService.getMyPrescriptionsAsDoctor(userId, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescriptions fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getMyPrescriptionsAsPatient = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) throw new Error('User ID not found');

    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PrescriptionService.getMyPrescriptionsAsPatient(userId, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescriptions fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getPrescriptionById = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    if (!userId || !userRole) throw new Error('User details not found');

    const result = await PrescriptionService.getPrescriptionById(userId, userRole, req.params.id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescription details fetched successfully',
        data: result,
    });
});

export const PrescriptionController = {
    createPrescription,
    getAllPrescriptions,
    getMyPrescriptionsAsDoctor,
    getMyPrescriptionsAsPatient,
    getPrescriptionById,
};