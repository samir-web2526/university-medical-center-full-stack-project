import { Request, Response } from "express";
import { catchAsync } from "../../sharedFile";
import { VisitService } from "./visit.service";
import sendResponse from "../../sharedFile/sendResponse";
import httpStatus from "http-status";
import pick from "../../sharedFile/pick";

const createVisit = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.user?.id as string;
    console.log(doctorId);
    const result = await VisitService.createVisit(doctorId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Visit created successfully",
        data: result,
    });
});

const getVisits = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['studentId', 'doctorId', 'visitDate']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await VisitService.getVisits(filters, options, req.user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Visits fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getVisitById = catchAsync(async (req: Request, res: Response) => {
    const result = await VisitService.getVisitById(req.params.id as string, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Visit fetched successfully",
        data: result,
    });
});

const updateVisit = catchAsync(async (req: Request, res: Response) => {
    const result = await VisitService.updateVisit(req.params.id as string, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Visit updated successfully",
        data: result,
    });
});

const deleteVisit = catchAsync(async (req: Request, res: Response) => {
    const result = await VisitService.deleteVisit(req.params.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Visit deleted successfully",
        data: result,
    });
});

export const VisitController = {
    createVisit,
    getVisits,
    getVisitById,
    updateVisit,
    deleteVisit,
};