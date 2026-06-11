import dotenv from 'dotenv';
import status from 'http-status';
import AppError from '../errorHelpers/appError';



dotenv.config();

interface EnvConfig {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    FRONTEND_URL: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: number;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: number;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    ADMIN_NAME: string;
    ADMIN_PHONE: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    RESET_TOKEN_SECRET: string;
    RESET_TOKEN_EXPIRES_IN: number;
}


const loadEnvVariables = (): EnvConfig => {

    const requireEnvVariable = [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'FRONTEND_URL',
        'ACCESS_TOKEN_SECRET',
        'ACCESS_TOKEN_EXPIRES_IN',
        'REFRESH_TOKEN_SECRET',
        'REFRESH_TOKEN_EXPIRES_IN',
        'ADMIN_EMAIL',
        'ADMIN_PASSWORD',
        'ADMIN_NAME',
        'ADMIN_PHONE',
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
        'RESET_TOKEN_SECRET',
        'RESET_TOKEN_EXPIRES_IN',
    ]

    requireEnvVariable.forEach((variable) => {
        if (!process.env[variable]) {
            // throw new Error(`Environment variable ${variable} is required but not set in .env file.`);
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${variable} is required but not set in .env file.`);
        }
    })

    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN as string),
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        REFRESH_TOKEN_EXPIRES_IN: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN as string),
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
        ADMIN_NAME: process.env.ADMIN_NAME as string,
        ADMIN_PHONE: process.env.ADMIN_PHONE as string,
        SMTP_HOST: process.env.SMTP_HOST as string,
        SMTP_PORT: parseInt(process.env.SMTP_PORT as string),
        SMTP_USER: process.env.SMTP_USER as string,
        SMTP_PASS: process.env.SMTP_PASS as string,
        RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET as string,
        RESET_TOKEN_EXPIRES_IN: parseInt(process.env.RESET_TOKEN_EXPIRES_IN as string),
    }
}

export const envVars = loadEnvVariables();
