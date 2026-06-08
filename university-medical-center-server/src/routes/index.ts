import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        routes: UserRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export const IndexRoutes = router;