import express from 'express';
import { PrescriptionController } from './prescription.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { PrescriptionValidation } from './prescription.validation';


const router = express.Router();

// Doctor creates prescription
router.post(
    '/',
    checkAuth('DOCTOR'),
    validateRequest(PrescriptionValidation.createPrescription),
    PrescriptionController.createPrescription
);

// Doctor sees all their issued prescriptions
router.get(
    '/doctor-prescriptions',
    checkAuth('DOCTOR'),
    PrescriptionController.getMyPrescriptionsAsDoctor
);

// Student sees all their received prescriptions
router.get(
    '/my-prescriptions',
    checkAuth('STUDENT'),
    PrescriptionController.getMyPrescriptionsAsPatient
);

// Admin sees all prescriptions
router.get(
    '/',
    checkAuth('ADMIN'),
    PrescriptionController.getAllPrescriptions
);

// Get single prescription details (Access checked inside service)
router.get(
    '/:id',
    checkAuth('ADMIN', 'DOCTOR', 'STUDENT'),
    PrescriptionController.getPrescriptionById
);

export const PrescriptionRoutes = router;
