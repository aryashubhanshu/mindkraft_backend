import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import Invitation from "../models/Invitation.js";

// Get dashboard summary metrics
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get timestamp for last month filtering
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Fetch assessments created by user
    const assessments = await Assessment.find(
      { createdBy: userId },
      "_id submissions createdAt"
    );

    const totalAssessments = assessments.length;
    const lastMonthAssessments = assessments.filter(
      (a) => a.createdAt >= lastMonth
    ).length;

    // Count total submissions and last month submissions
    let totalSubmissions = 0;
    let lastMonthSubmissions = 0;

    assessments.forEach((assessment) => {
      totalSubmissions += assessment.submissions.length;
      lastMonthSubmissions += assessment.submissions.filter(
        (s) => s.submittedAt >= lastMonth
      ).length;
    });

    // Find invitations for these assessments
    const assessmentIds = assessments.map((a) => a._id);
    const invitations = await Invitation.find(
      { assessmentId: { $in: assessmentIds } },
      "users createdAt"
    );

    const totalInvitations = invitations.reduce(
      (acc, inv) => acc + inv.users.length,
      0
    );
    const lastMonthInvitations = invitations
      .filter((inv) => inv.createdAt >= lastMonth)
      .reduce((acc, inv) => acc + inv.users.length, 0);

    res.json({
      totalAssessments,
      assessmentsChange: lastMonthAssessments, // Change from last month
      totalSubmissions,
      submissionsChange: lastMonthSubmissions, // Change from last month
      totalInvitations,
      invitationsChange: lastMonthInvitations, // Change from last month
    });
  } catch (error) {
    next(error);
  }
};

// Get data for charts
export const getChartData = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { timeRange } = req.query;

    // Calculate date range based on timeRange
    let startDate;
    const today = new Date();

    switch (timeRange) {
      case "7d":
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case "15d":
        startDate = new Date();
        startDate.setDate(today.getDate() - 15);
        break;
      case "1m":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3m":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6m":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "all":
      default:
        startDate = null; // No filtering for "Overall"
        break;
    }

    const matchStage = { createdBy: userId };
    if (startDate) matchStage.createdAt = { $gte: startDate };

    // Count by Type
    const typesData = await Assessment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // Count by User Group
    const userGroupsData = await Assessment.aggregate([
      { $match: matchStage },
      { $unwind: "$userGroup" },
      {
        $group: {
          _id: "$userGroup",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      types: typesData,
      userGroups: userGroupsData,
    });
  } catch (error) {
    next(error);
  }
};
