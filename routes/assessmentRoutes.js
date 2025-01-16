import express from "express";

import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
} from "../controllers/assessmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAssessment);
router.get("/", authMiddleware, getAssessments);
router.get("/:id", authMiddleware, getAssessmentById);
router.put("/:id", authMiddleware, updateAssessment);
router.delete("/:id", authMiddleware, deleteAssessment);

export default router;