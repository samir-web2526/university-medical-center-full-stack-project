import express from 'express';
import { MedicineController } from './medicine.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { MedicineValidation } from './medicine.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../generated/enums';

const router = express.Router();

router.post(
    '/',
    checkAuth(Role.ADMIN),
    validateRequest(MedicineValidation.createMedicineValidationSchema),
    MedicineController.createMedicine
);

router.get(
    '/',
    checkAuth(Role.ADMIN, Role.DOCTOR, Role.STUDENT),
    MedicineController.getAllMedicines
);

router.get(
    '/:id',
    checkAuth(Role.ADMIN, Role.DOCTOR, Role.STUDENT),
    MedicineController.getSingleMedicine
);

router.patch(
    '/:id',
    checkAuth(Role.ADMIN),
    validateRequest(MedicineValidation.updateMedicineValidationSchema),
    MedicineController.updateMedicine
);

router.delete(
    '/:id',
    checkAuth(Role.ADMIN),
    MedicineController.deleteMedicine
);

router.patch(
    '/:id/increase-stock',
    checkAuth(Role.ADMIN),
    validateRequest(MedicineValidation.updateStockValidationSchema),
    MedicineController.increaseStock
);

router.patch(
    '/:id/decrease-stock',
    checkAuth(Role.ADMIN),
    validateRequest(MedicineValidation.updateStockValidationSchema),
    MedicineController.decreaseStock
);

export const MedicineRoutes = router;
