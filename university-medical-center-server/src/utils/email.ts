const nodemailer = require("nodemailer");
import { envVars } from '../config/env';

const transporter = nodemailer.createTransport({
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    secure: false, // TLS
    auth: {
        user: envVars.SMTP_USER,
        pass: envVars.SMTP_PASS,
    },
});

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
    await transporter.sendMail({
        from: `"University Medical Center" <${envVars.SMTP_USER}>`,
        to,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #1d4ed8;">University Medical Center</h2>
                <p>You requested to reset your password. Click the button below to set a new password.</p>
                <p>This link is valid for <strong>15 minutes</strong>.</p>
                <a href="${resetLink}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Reset Password
                </a>
                <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
                    If you did not request a password reset, please ignore this email.
                    <br/>
                    This link will expire in 15 minutes.
                </p>
            </div>
        `,
    });
};
