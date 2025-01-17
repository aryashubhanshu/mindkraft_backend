import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import {
  sendInvitations,
  getInvitations,
} from "../controllers/invitationController.js";

const router = express.Router();

// Routes for invitations
router.post("/:assessmentId/invite", authMiddleware, sendInvitations);
router.get("/:assessmentId", authMiddleware, getInvitations);

export default router;
