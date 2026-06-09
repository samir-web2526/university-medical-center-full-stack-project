import express from 'express';
import { VisitController } from './visit.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { VisitValidation } from './visit.validation';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.post(
    '/',
    checkAuth('DOCTOR'),
    validateRequest(VisitValidation.createVisitSchema),
    VisitController.createVisit
);

router.get(
    '/',
    checkAuth('ADMIN', 'DOCTOR', 'STUDENT'),
    VisitController.getVisits
);

router.get(
    '/:id',
    checkAuth('ADMIN', 'DOCTOR', 'STUDENT'),
    VisitController.getVisitById
);

router.patch(
    '/:id',
    checkAuth('DOCTOR'),
    validateRequest(VisitValidation.updateVisitSchema),
    VisitController.updateVisit
);

router.delete(
    '/:id',
    checkAuth('ADMIN'),
    VisitController.deleteVisit
);

export const VisitRoutes = router;
