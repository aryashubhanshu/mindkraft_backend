import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import { getStatistics } from "../controllers/statisticsController.js";

const router = express.Router();

// Route to fetch statistics for a specific assessment
// Only "admin" users can access this route
router.get(
  "/:assessmentId",
  authMiddleware,
  roleMiddleware(["admin"]),
  getStatistics
);

export default router;
