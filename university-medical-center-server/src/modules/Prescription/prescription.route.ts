import express from 'express';
import { PrescriptionController } from './prescription.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { PrescriptionValidation } from './prescription.validation';


const router = express.Router();

router.post(
    '/',
    checkAuth('DOCTOR'),
    validateRequest(PrescriptionValidation.createPrescription),
    PrescriptionController.createPrescription
);

router.get(
    '/doctor-prescriptions',
    checkAuth('DOCTOR'),
    PrescriptionController.getMyPrescriptionsAsDoctor
);

router.get(
    '/my-prescriptions',
    checkAuth('STUDENT'),
    PrescriptionController.getMyPrescriptionsAsPatient
);

router.get(
    '/',
    checkAuth('ADMIN'),
    PrescriptionController.getAllPrescriptions
);

router.get(
    '/:id',
    checkAuth('ADMIN', 'DOCTOR', 'STUDENT'),
    PrescriptionController.getPrescriptionById
);

router.patch(
    '/:id/cancel',
    checkAuth('DOCTOR'),
    validateRequest(PrescriptionValidation.cancelPrescription),
    PrescriptionController.cancelPrescription
);

export const PrescriptionRoutes = router;
