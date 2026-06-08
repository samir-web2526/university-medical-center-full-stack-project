import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../sharedFile/sendResponse";
import status from "http-status";
import pick from "../../sharedFile/pick";

const getMyProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    if (!userId) {
        throw new Error('User ID not found in request');
    }

    const result = await DoctorService.getMyProfile(userId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctor profile fetched successfully',
        data: result,
    });
};

const updateMyProfile = async (req: Request, res: Response) => {
    const result = await DoctorService.updateMyProfile(req.user.id as string, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctor profile updated successfully',
        data: result,
    });
};

const getAllDoctors = async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerm', 'doctorId', 'name', 'email', 'contactNo', 'gender', 'bloodGroup', 'specialization', 'visitingHours', 'isActive']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await DoctorService.getAllDoctors(filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctors fetched successfully',
        meta: result.meta,
        data: result.data,
    });
};

const getSingleDoctor = async (req: Request, res: Response) => {
    const result = await DoctorService.getSingleDoctor(req.params.id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctor fetched successfully',
        data: result,
    });
};

const updateDoctor = async (req: Request, res: Response) => {
    const result = await DoctorService.updateDoctor(req.params.id as string, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctor updated successfully',
        data: result,
    });
};

const deleteDoctor = async (req: Request, res: Response) => {
    await DoctorService.deleteDoctor(req.params.id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctor deleted successfully',
    });
};

export const DoctorController = {
    getMyProfile,
    updateMyProfile,
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
};