import { Request, Response } from 'express';
import catchAsync from '../../sharedFile/catchAsync';
import sendResponse from '../../sharedFile/sendResponse';
import status from 'http-status';
import { PrescriptionMedicineService } from './prescriptionMedicine.service';

const addMedicineToPrescription = catchAsync(async (req: Request, res: Response) => {
    const result = await PrescriptionMedicineService.addMedicineToPrescription(req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Medicine added to prescription successfully',
        data: result,
    });
});

const updatePrescriptionMedicine = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PrescriptionMedicineService.updatePrescriptionMedicine(id as string, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescription medicine updated successfully',
        data: result,
    });
});

const removePrescriptionMedicine = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PrescriptionMedicineService.removePrescriptionMedicine(id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescription medicine removed successfully',
        data: result,
    });
});

const getPrescriptionMedicinesByPrescriptionId = catchAsync(async (req: Request, res: Response) => {
    const { prescriptionId } = req.params;
    const result = await PrescriptionMedicineService.getPrescriptionMedicinesByPrescriptionId(prescriptionId as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Prescription medicines retrieved successfully',
        data: result,
    });
});

export const PrescriptionMedicineController = {
    addMedicineToPrescription,
    updatePrescriptionMedicine,
    removePrescriptionMedicine,
    getPrescriptionMedicinesByPrescriptionId,
};