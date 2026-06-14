import { Request, Response } from 'express';
import status from 'http-status';
import sendResponse from '../../sharedFile/sendResponse';
import { catchAsync } from '../../sharedFile';
import { OcrService } from './ocr.service';

const extractPrescription = catchAsync(async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        throw new Error('Image URL is required');
    }

    const result = await OcrService.extractPrescription(imageUrl);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescription extracted successfully',
        data: result,
    });
});

export const OcrController = {
    extractPrescription,
};
