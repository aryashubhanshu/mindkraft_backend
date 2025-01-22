import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import Invitation from "../models/Invitation.js";

// Get dashboard summary metrics
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalAssessments = await Assessment.countDocuments({
      createdBy: req.user.id,
    });
    const totalSubmissions = await Assessment.aggregate([
      { $match: { createdBy: req.user.id } },
      { $unwind: "$submissions" },
      { $count: "totalSubmissions" },
    ]);

    const totalInvitations = await Invitation.aggregate([
      { $match: { "users.status": "Invited" } },
      { $unwind: "$users" },
      { $count: "totalInvitations" },
    ]);

    res.json({
      totalAssessments,
      totalSubmissions: totalSubmissions[0]?.totalSubmissions || 0,
      totalInvitations: totalInvitations[0]?.totalInvitations || 0,
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
