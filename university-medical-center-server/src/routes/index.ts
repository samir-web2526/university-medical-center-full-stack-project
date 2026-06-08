import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { StudentRoutes } from "../modules/Student/student.route";
import { DoctorRoutes } from "../modules/Doctor/doctor.route";

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
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export const IndexRoutes = router;