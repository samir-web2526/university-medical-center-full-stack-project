import { Router } from "express";

const router = Router();
const moduleRoutes = [

]

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export const IndexRoutes = router;