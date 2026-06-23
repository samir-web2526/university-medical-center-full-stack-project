import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../sharedFile';
import status from 'http-status';
import { ComplaintService } from './complaint.service';
import pick from '../../sharedFile/pick';

const createComplaint = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id ?? null;
    const result = await ComplaintService.createComplaint(req.body, userId);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Complaint submitted successfully',
        data: result,
    });
});

const getAllComplaints = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, [
        'limit',
        'page',
        'sortBy',
        'sortOrder',
    ]);

    const filters = pick(req.query, ['searchTerm']);

    const result = await ComplaintService.getAllComplaints(options, filters);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Complaints retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

const deleteComplaint = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ComplaintService.deleteComplaint(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Complaint deleted successfully',
        data: result,
    });
});

export const ComplaintController = {
    createComplaint,
    getAllComplaints,
    deleteComplaint,
};
