import express from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { userValidationSchema } from './user.validation';

import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../generated/enums';

const router = express.Router();

router.post(
    '/register',
    validateRequest(userValidationSchema.registerUserValidationSchema),
    UserController.registerUser
);

router.post(
    '/create-doctor',
    checkAuth(Role.ADMIN),
    validateRequest(userValidationSchema.createDoctorValidationSchema),
    UserController.createDoctor
);

router.patch(
    '/change-password',
    checkAuth(Role.ADMIN, Role.DOCTOR, Role.STUDENT),
    validateRequest(userValidationSchema.changePasswordValidationSchema),
    UserController.changePassword
);

router.patch(
    '/update-doctor-profile',
    checkAuth(Role.DOCTOR),
    validateRequest(userValidationSchema.updateDoctorProfileValidationSchema),
    UserController.updateDoctorProfile
);

router.post(
    '/login',
    validateRequest(userValidationSchema.loginUserValidationSchema),
    UserController.loginUser
);

router.post(
    '/refresh-token',
    UserController.refreshToken
);

router.post(
    '/logout',
    UserController.logoutUser
);

export const UserRoutes = router;
