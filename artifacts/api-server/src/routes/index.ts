import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketplaceRouter from "./marketplace";
import bookingsRouter from "./bookings";
import dashboardsRouter from "./dashboards";

const router: IRouter = Router();

router.use(healthRouter);
router.use(marketplaceRouter);
router.use(bookingsRouter);
router.use(dashboardsRouter);

export default router;
