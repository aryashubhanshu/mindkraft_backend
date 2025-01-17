import express from "express";
import authRoutes from "./authRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import statisticsRoutes from "./statisticsRoutes.js";
import invitationRoutes from "./invitationRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/statistics", statisticsRoutes);
router.use("/invitations", invitationRoutes);

export default router;
