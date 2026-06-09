import express from 'express';
import { NotificationController } from './notification.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../generated/enums';
import { validateRequest } from '../../middlewares/validateRequest';
import { notificationValidationSchema } from './notification.validation';

const router = express.Router();

router.get(
    '/my-notifications',
    checkAuth(Role.STUDENT, Role.DOCTOR),
    validateRequest(notificationValidationSchema.paginationValidation),
    NotificationController.getMyNotifications
);

router.get(
    '/all',
    checkAuth(Role.ADMIN),
    validateRequest(notificationValidationSchema.paginationValidation),
    NotificationController.getAllNotifications
);

router.patch(
    '/mark-all-as-read',
    checkAuth(Role.STUDENT, Role.DOCTOR),
    NotificationController.markAllAsRead
);

router.patch(
    '/mark-as-read/:id',
    checkAuth(Role.STUDENT, Role.DOCTOR),
    validateRequest(notificationValidationSchema.markAsReadValidation),
    NotificationController.markAsRead
);

router.delete(
    '/:id',
    checkAuth(Role.ADMIN),
    validateRequest(notificationValidationSchema.deleteValidation),
    NotificationController.deleteNotification
);

export const notificationRoutes = router;
