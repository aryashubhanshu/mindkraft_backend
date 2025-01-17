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
    const submissionsByType = await Assessment.aggregate([
      { $match: { createdBy: req.user.id } },
      {
        $group: {
          _id: "$type",
          submissions: { $sum: { $size: "$submissions" } },
        },
      },
    ]);

    res.json({ submissionsByType });
  } catch (error) {
    next(error);
  }
};
