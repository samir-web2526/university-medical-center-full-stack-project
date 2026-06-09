import express from 'express';
import { PrescriptionMedicineController } from './prescriptionMedicine.controller';
import { prescriptionMedicineValidationSchema } from './prescriptionMedicine.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../generated/enums';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
    '/',
    checkAuth(Role.ADMIN, Role.DOCTOR),
    validateRequest(prescriptionMedicineValidationSchema.createValidation),
    PrescriptionMedicineController.addMedicineToPrescription
);

router.get(
    '/:prescriptionId',
    checkAuth(Role.ADMIN, Role.DOCTOR, Role.STUDENT),
    PrescriptionMedicineController.getPrescriptionMedicinesByPrescriptionId
);

router.patch(
    '/:id',
    checkAuth(Role.ADMIN, Role.DOCTOR),
    validateRequest(prescriptionMedicineValidationSchema.updateValidation),
    PrescriptionMedicineController.updatePrescriptionMedicine
);

router.delete(
    '/:id',
    checkAuth(Role.ADMIN, Role.DOCTOR),
    PrescriptionMedicineController.removePrescriptionMedicine
);

export const prescriptionMedicineRoutes = router;
