import express from 'express';
import { StudentController } from './student.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { studentValidation } from './student.validation';

const router = express.Router();

router.get(
    '/profile',
    checkAuth('STUDENT'),
    StudentController.getMyProfile
);

router.patch(
    '/profile',
    checkAuth('STUDENT'),
    validateRequest(studentValidation.updateStudentValidationSchemaByOwn),
    StudentController.updateMyProfile
);

router.get(
    '/',
    checkAuth('ADMIN'),
    StudentController.getAllStudents
);

router.patch(
    '/:id',
    checkAuth('ADMIN'),
    validateRequest(studentValidation.updateStudentValidationSchemaByAdmin),
    StudentController.updateStudent
);

router.delete(
    '/:id',
    checkAuth('ADMIN'),
    StudentController.deleteStudent
);

export const StudentRoutes = router;
