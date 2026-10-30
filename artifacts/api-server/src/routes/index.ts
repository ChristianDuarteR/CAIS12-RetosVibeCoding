import { Router, type IRouter } from "express";
import healthRouter from "./health";
import patientsRouter from "./patients";
import visitsRouter from "./visits";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(patientsRouter);
router.use(visitsRouter);
router.use(dashboardRouter);

export default router;
