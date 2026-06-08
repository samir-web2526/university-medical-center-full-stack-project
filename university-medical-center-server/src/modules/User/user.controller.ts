import { Request, Response } from "express";
import { catchAsync, sendResponse } from "../../sharedFile";
import status from "http-status";
import { envVars } from "../../config/env";
import { UserService } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.registerUser(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User created successfully',
        data: result,
    });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctor created successfully',
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await UserService.changePassword(userId, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Password changed successfully',
        data: result,
    });
});

const updateDoctorProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await UserService.updateDoctorProfile(userId, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctor profile updated successfully',
        data: result,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.login(req.body);
    const { refreshToken, accessToken, mustChangePassword, isProfileComplete } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: envVars.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User logged in successfully',
        data: {
            accessToken,
            refreshToken,
            mustChangePassword,
            isProfileComplete,
        },
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken: token } = req.cookies;
    const result = await UserService.refreshToken(token);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Access token refreshed successfully',
        data: result,
    });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User logged out successfully',
        data: null,
    });
});

export const UserController = {
    registerUser,
    createDoctor,
    changePassword,
    updateDoctorProfile,
    loginUser,
    refreshToken,
    logoutUser,
};