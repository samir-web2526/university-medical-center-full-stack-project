import { Request, Response } from 'express';
import status from 'http-status';
import { PrescriptionService } from './prescription.service';
import sendResponse from '../../sharedFile/sendResponse';
import pick from '../../sharedFile/pick';
import { catchAsync } from '../../sharedFile';
import AppError from '../../errorHelpers/appError';

const getUserFromReq = (req: Request) => {
    const user = (req as any).user;
    if (!user?.id) {
        throw new AppError(status.UNAUTHORIZED, 'User not found');
    }
    return user;
};

const createPrescription = catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = getUserFromReq(req);
    const result = await PrescriptionService.createPrescription(
        userId,
        req.body
    );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Prescription created successfully',
        data: result,
    });
});

const getAllPrescriptions = catchAsync(async (req: Request, res: Response) => {

    const options = pick(req.query, [
        'limit',
        'page',
        'sortBy',
        'sortOrder',
    ]);

    const filters = pick(req.query, [
        'searchTerm',
        'doctorId',
        'studentId',
        'visitId',
    ]);

    const result = await PrescriptionService.getAllPrescriptions(filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescriptions fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getMyPrescriptionsAsDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = getUserFromReq(req);
    const options = pick(req.query, [
        'limit',
        'page',
        'sortBy',
        'sortOrder',
    ]);

    const filters = pick(req.query, [
        'searchTerm',
    ]);

    const result = await PrescriptionService.getMyPrescriptionsAsDoctor(
        userId,
        options,
        filters
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescriptions fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getMyPrescriptionsAsPatient = catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = getUserFromReq(req);
    const options = pick(req.query, [
        'limit',
        'page',
        'sortBy',
        'sortOrder',
    ]);
    const result = await PrescriptionService.getMyPrescriptionsAsPatient(
        userId,
        options
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescriptions fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getPrescriptionById = catchAsync(async (req: Request, res: Response) => {
    const { id: userId, role: userRole } = getUserFromReq(req);
    const result = await PrescriptionService.getPrescriptionById(
        userId,
        userRole,
        req.params.id as string
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescription details fetched successfully',
        data: result,
    });
});

const cancelPrescription = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const result = await PrescriptionService.cancelPrescription(
        id as string,
        cancelReason
    );

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescription cancelled successfully',
        data: result,
    });
});

export const PrescriptionController = {
    createPrescription,
    getAllPrescriptions,
    getMyPrescriptionsAsDoctor,
    getMyPrescriptionsAsPatient,
    getPrescriptionById,
    cancelPrescription
};