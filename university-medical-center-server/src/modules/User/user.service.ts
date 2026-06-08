import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '../../generated/client';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { tokenUtils } from '../../utils/token';
import { jwtUtils } from '../../utils/jwt';
import { envVars } from '../../config/env';

const registerUser = async (payload: any) => {
    const { password, email, role, name, student } = payload;

    if (role !== Role.STUDENT) {
        throw new AppError(status.FORBIDDEN, 'Only students can self-register');
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError(status.CONFLICT, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                mustChangePassword: false,
                isProfileComplete: true,
            },
        });

        if (!student) {
            throw new AppError(status.BAD_REQUEST, 'Student details are required');
        }
        await tx.student.create({
            data: {
                ...student,
                userId: newUser.id,
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    });

    return result;
};

const createDoctor = async (payload: any) => {
    const { email, name, temporaryPassword } = payload;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError(status.CONFLICT, 'User with this email already exists');
    }

    const defaultPassword = temporaryPassword || 'doctor@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.DOCTOR,
                mustChangePassword: true,
                isProfileComplete: false,
            },
        });

        await tx.doctor.create({
            data: {
                userId: newUser.id,
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;
        return {
            ...userWithoutPassword,
            temporaryPassword: defaultPassword,
        };
    });

    return result;
};

const changePassword = async (userId: string, payload: any) => {
    const { oldPassword, newPassword } = payload;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError(status.UNAUTHORIZED, 'Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id: userId },
        data: {
            password: hashedPassword,
            mustChangePassword: false,
        },
    });

    return { message: 'Password changed successfully' };
};

const updateDoctorProfile = async (userId: string, payload: any) => {
    const { phone, ...doctorData } = payload;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { doctor: true },
    });

    if (!user || user.role !== Role.DOCTOR) {
        throw new AppError(status.NOT_FOUND, 'Doctor not found');
    }

    const result = await prisma.$transaction(async (tx) => {

        if (phone) {
            await tx.user.update({
                where: { id: userId },
                data: {
                    phone,
                    isProfileComplete: true,
                },
            });
        }

        const updatedDoctor = await tx.doctor.update({
            where: { userId },
            data: doctorData,
        });

        return updatedDoctor;
    });

    return result;
};

const login = async (payload: any) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    if (!user.isActive) {
        throw new AppError(status.FORBIDDEN, 'User is inactive');
    }

    if (user.status === 'BLOCKED') {
        throw new AppError(status.FORBIDDEN, 'User is blocked');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new AppError(status.UNAUTHORIZED, 'Invalid password');
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = tokenUtils.getAccessToken(jwtPayload);
    const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

    return {
        accessToken,
        refreshToken,
        mustChangePassword: user.mustChangePassword,
        isProfileComplete: user.isProfileComplete,
    };
};

const refreshToken = async (token: string) => {
    if (!token) {
        throw new AppError(status.UNAUTHORIZED, 'No refresh token provided');
    }

    const verifyResponse = jwtUtils.verifyToken(token, envVars.REFRESH_TOKEN_SECRET);
    if (!verifyResponse.success) {
        throw new AppError(status.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    const { id } = verifyResponse.data!;

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    if (!user.isActive) {
        throw new AppError(status.FORBIDDEN, 'User is inactive');
    }

    if (user.status === 'BLOCKED') {
        throw new AppError(status.FORBIDDEN, 'User is blocked');
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = tokenUtils.getAccessToken(jwtPayload);

    return {
        accessToken,
    };
};

export const UserService = {
    registerUser,
    createDoctor,
    changePassword,
    updateDoctorProfile,
    login,
    refreshToken,
};