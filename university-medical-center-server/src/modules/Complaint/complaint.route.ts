import express from 'express';
import { ComplaintController } from './complaint.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { complaintValidationSchema } from './complaint.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../generated/enums';

const router = express.Router();

router.post(
    '/',
    checkAuth(Role.STUDENT),
    validateRequest(complaintValidationSchema.createComplaintValidationSchema),
    ComplaintController.createComplaint
);

router.get(
    '/',
    checkAuth(Role.ADMIN),
    validateRequest(complaintValidationSchema.paginationValidation),
    ComplaintController.getAllComplaints
);

router.delete(
    '/:id',
    checkAuth(Role.ADMIN),
    validateRequest(complaintValidationSchema.deleteValidation),
    ComplaintController.deleteComplaint
);

export const ComplaintRoutes = router;
