import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import {
  sendInvitations,
  getInvitations,
  bulkUploadInvitations,
} from "../controllers/invitationController.js";

const router = express.Router();

// Routes for invitations
router.post("/:assessmentId/invite", authMiddleware, sendInvitations);
router.get("/:assessmentId", authMiddleware, getInvitations);
router.post(
  "/:assessmentId/bulk-invite",
  authMiddleware,
  bulkUploadInvitations
);

export default router;
