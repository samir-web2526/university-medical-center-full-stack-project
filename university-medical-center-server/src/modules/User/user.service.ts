import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import { Role, UserStatus } from '../../generated/client';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';
import { tokenUtils } from '../../utils/token';
import { jwtUtils } from '../../utils/jwt';
import { envVars } from '../../config/env';
import { sendPasswordResetEmail } from '../../utils/email';
import { SignOptions } from 'jsonwebtoken';

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
                status: UserStatus.INACTIVE,
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

    if (user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, 'User is blocked');
    }

    if (user.status === UserStatus.INACTIVE) {
        throw new AppError(status.FORBIDDEN, 'Your account is pending admin approval. Please wait until your account is activated.');
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

    if (user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, 'User is blocked');
    }

    if (user.status === UserStatus.INACTIVE) {
        throw new AppError(status.FORBIDDEN, 'Your account is pending admin approval. Please wait until your account is activated.');
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

const forgotPassword = async (payload: { email: string }) => {
    const { email } = payload;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'No account found with this email');
    }

    if (!user.isActive || user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, 'Your account is inactive or blocked');
    }

    if (user.status === UserStatus.INACTIVE) {
        throw new AppError(status.FORBIDDEN, 'Your account is pending admin approval. Please wait until your account is activated.');
    }

    const resetPayload = { id: user.id, email: user.email };
    const options: SignOptions = { expiresIn: envVars.RESET_TOKEN_EXPIRES_IN };
    const resetToken = jwtUtils.createToken(resetPayload, envVars.RESET_TOKEN_SECRET, options);

    const resetLink = `${envVars.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetLink);

    return { message: 'Password reset link sent to your email' };
};

const resetPassword = async (payload: { token: string; newPassword: string }) => {
    const { token, newPassword } = payload;

    const verifyResponse = jwtUtils.verifyToken(token, envVars.RESET_TOKEN_SECRET);

    if (!verifyResponse.success) {
        throw new AppError(status.UNAUTHORIZED, 'Reset link is invalid or has expired');
    }

    const { id } = verifyResponse.data!;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id },
        data: {
            password: hashedPassword,
            mustChangePassword: false,
        },
    });

    return { message: 'Password reset successfully' };
};

const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    return user;
};

const updateMyProfile = async (userId: string, payload: { name?: string; email?: string; phone?: string }) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    if (user.role !== Role.ADMIN) {
        throw new AppError(status.FORBIDDEN, 'Only admins can update their own profile through this endpoint');
    }

    const { name, email, phone } = payload;

    const result = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(name && { name }),
            ...(email && { email }),
            ...(phone !== undefined && { phone }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return result;
};

const updateUserStatus = async (userId: string, payload: { status: UserStatus }) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const result = await prisma.user.update({
        where: { id: userId },
        data: { status: payload.status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            isActive: true,
        }
    });

    return result;
};

export const UserService = {
    registerUser,
    createDoctor,
    changePassword,
    updateDoctorProfile,
    getMyProfile,
    updateMyProfile,
    login,
    refreshToken,
    forgotPassword,
    resetPassword,
    updateUserStatus,
};