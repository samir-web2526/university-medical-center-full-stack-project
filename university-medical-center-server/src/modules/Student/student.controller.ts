import { catchAsync } from "../../sharedFile";
import { StudentService } from "./student.service";
import { Request, Response } from "express";
import sendResponse from "../../sharedFile/sendResponse";
import pick from "../../sharedFile/pick";
import { studentFilterableFields } from "./student.constant";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentService.getMyProfile(req.user.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Student profile retrieved successfully",
        data: result,
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentService.updateMyProfile(req.user.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Student profile updated successfully",
        data: result,
    });
});

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, studentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await StudentService.getAllStudents(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Students retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentService.updateStudent(req.params.id as string, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Student updated successfully",
        data: result,
    });
});

const deleteStudent = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentService.deleteStudent(req.params.id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Student deleted successfully",
        data: result,
    });
});

export const StudentController = {
    getMyProfile,
    updateMyProfile,
    getAllStudents,
    updateStudent,
    deleteStudent,
};