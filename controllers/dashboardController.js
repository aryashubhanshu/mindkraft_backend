import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import Invitation from "../models/Invitation.js";

// Get dashboard summary metrics
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get timestamps for filtering
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);

    // Fetch assessments created by user
    const assessments = await Assessment.find(
      { createdBy: userId },
      "_id submissions createdAt"
    );

    const totalAssessments = assessments.length;
    const lastMonthAssessments = assessments.filter(
      (a) => a.createdAt >= lastMonth
    ).length;

    // Count total submissions and last day submissions
    let totalSubmissions = 0;
    let lastDaySubmissions = 0;

    assessments.forEach((assessment) => {
      totalSubmissions += assessment.submissions.length;
      lastDaySubmissions += assessment.submissions.filter(
        (s) => s.submittedAt >= lastDay
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
      submissionsChange: lastDaySubmissions, // Change from last day
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

    // Count by Type
    const typesData = await Assessment.aggregate([
      { $match: { createdBy: userId } }, // Match assessments created by the user
      {
        $group: {
          _id: "$type", // Group by the "type" field
          count: { $sum: 1 }, // Count the number of assessments of each type
        },
      },
    ]);

    // Count by User Group
    const userGroupsData = await Assessment.aggregate([
      { $match: { createdBy: userId } }, // Match assessments created by the user
      { $unwind: "$userGroup" }, // Unwind the array of user groups
      {
        $group: {
          _id: "$userGroup", // Group by each user group value
          count: { $sum: 1 }, // Count the number of occurrences for each user group
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
