import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { StudentRoutes } from "../modules/Student/student.route";
import { DoctorRoutes } from "../modules/Doctor/doctor.route";
import { PrescriptionRoutes } from "../modules/Prescription/prescription.route";
import { VisitRoutes } from "../modules/Visit/visit.route";
import { MedicineRoutes } from "../modules/Medicine/medicine.route";
import { prescriptionMedicineRoutes } from "../modules/PrescriptionMedicine/prescriptionMedicine.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        routes: UserRoutes,
    },
    {
        path: "/students",
        routes: StudentRoutes,
    },
    {
        path: "/doctors",
        routes: DoctorRoutes,
    },
    {
        path: "/visits",
        routes: VisitRoutes,
    },
    {
        path: "/prescriptions",
        routes: PrescriptionRoutes,
    },
    {
        path: "/medicines",
        routes: MedicineRoutes,
    },
    {
        path: "/prescription-medicines",
        routes: prescriptionMedicineRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export const IndexRoutes = router;