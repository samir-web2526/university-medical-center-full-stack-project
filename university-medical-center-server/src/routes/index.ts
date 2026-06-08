import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { StudentRoutes } from "../modules/Student/student.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        routes: UserRoutes,
    },
    {
        path: "/students",
        routes: StudentRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export const IndexRoutes = router;