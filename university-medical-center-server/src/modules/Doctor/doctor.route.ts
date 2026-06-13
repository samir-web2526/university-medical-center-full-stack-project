import express from 'express';
import { DoctorController } from './doctor.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { doctorValidationSchema } from './doctor.validation';

const router = express.Router();

router.get(
    '/profile',
    checkAuth('DOCTOR'),
    DoctorController.getMyProfile
);

router.patch(
    '/profile',
    checkAuth('DOCTOR'),
    validateRequest(doctorValidationSchema.updateMyProfile),
    DoctorController.updateMyProfile
);

router.get(
    '/',
    checkAuth('ADMIN'),
    DoctorController.getAllDoctors
);

router.get(
    '/:id',
    checkAuth('ADMIN'),
    DoctorController.getSingleDoctor
);

router.patch(
    '/:id',
    checkAuth('ADMIN'),
    validateRequest(doctorValidationSchema.updateDoctor),
    DoctorController.updateDoctor
);

router.delete(
    '/:id',
    checkAuth('ADMIN'),
    DoctorController.deleteDoctor
);

export const DoctorRoutes = router;
