import express from "express";

import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  recordSubmission,
} from "../controllers/assessmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Only "admin" users can create, update, or delete assessments
router.post("/", authMiddleware, roleMiddleware(["admin"]), createAssessment);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateAssessment);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteAssessment
);

// "admin" and "user" users can view assessments
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  getAssessments
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  getAssessmentById
);

router.post("/:assessmentId/submit", authMiddleware, recordSubmission);

export default router;
