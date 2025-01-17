import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import { getStatistics } from "../controllers/statisticsController.js";

const router = express.Router();

// Route to fetch statistics for a specific assessment
router.get("/:assessmentId", authMiddleware, getStatistics);

export default router;
