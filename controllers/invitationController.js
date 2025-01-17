import Assessment from "../models/Assessment.js";
import Invitation from "../models/Invitation.js";

// Send invitation to users
export const sendInvitations = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { users } = req.body; // Array of user emails

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    let invitation = await Invitation.findOne({ assessmentId });
    if (!invitation) {
      invitation = new Invitation({ assessmentId, users: [] });
    }

    // TODO: Send email to users with the assessment link
    users.forEach((email) => {
      if (!invitation.users.some((user) => user.email === email)) {
        invitation.users.push({ email });
      }
    });

    await invitation.save();
    res
      .status(201)
      .json({ message: "Invitations sent successfully", invitation });
  } catch (error) {
    res.status(500).json({ message: "Error sending invitations", error });
  }
};

// Get all invitations for an assessment
export const getInvitations = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const invitation = await Invitation.findOne({ assessmentId });

    if (!invitation) {
      return res
        .status(404)
        .json({ message: "No invitations found for this assessment" });
    }

    res.json(invitation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invitations", error });
  }
};
