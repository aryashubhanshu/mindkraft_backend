import Assessment from "../models/Assessment.js";

// Get statistics for a specific assessment
export const getStatistics = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findById(assessmentId)
      .populate("createdBy", "username") // Optional: Populate creator info
      .populate("submissions.userId", "username"); // Optional: Populate user info

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const totalInvited = assessment.userGroup.length; // Total user groups targeted
    const totalSubmissions = assessment.submissions.length;

    res.json({
      assessmentName: assessment.name,
      totalInvited,
      totalSubmissions,
      submissions: assessment.submissions, // Optional: Full submission details
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error });
  }
};
