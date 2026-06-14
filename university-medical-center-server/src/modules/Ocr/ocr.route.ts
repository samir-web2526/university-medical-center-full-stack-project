import express from 'express';
import { OcrController } from './ocr.controller';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.post(
    '/extract-prescription',
    checkAuth('DOCTOR'),
    OcrController.extractPrescription
);

export const ocrRoutes = router;
