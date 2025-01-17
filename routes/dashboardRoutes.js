import express from "express";

import {
  getDashboardMetrics,
  getChartData,
} from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Routes for dashboard metrics
router.get(
  "/metrics",
  authMiddleware,
  roleMiddleware("admin", "user"),
  getDashboardMetrics
);
router.get(
  "/charts",
  authMiddleware,
  roleMiddleware("admin", "user"),
  getChartData
);

export default router;
