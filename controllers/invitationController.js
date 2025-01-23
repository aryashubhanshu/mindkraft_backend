import multer from "multer";
import fs from "fs";
import csvParser from "csv-parser";

import Assessment from "../models/Assessment.js";
import Invitation from "../models/Invitation.js";

import sendEmail from "../utils/emailService.js";

// Configuring multer for file upload
const uplaod = multer({ dest: "uploads/" }); // Temporary folder to store uploaded files

// Send invitation to users
export const sendInvitations = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { users } = req.body; // Array of user object (email, firstName, lastName, phone)

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    let invitation = await Invitation.findOne({ assessmentId });
    if (!invitation) {
      invitation = new Invitation({ assessmentId, users: [] });
    }

    users.forEach(({ email, firstName, lastName, phone }) => {
      if (!invitation.users.some((user) => user.email === email)) {
        // Add user if the email does not already exist
        invitation.users.push({
          email,
          firstName,
          lastName,
          phone,
          status: "invited",
          invitedAt: new Date(),
        });

        // TODO: Send email with the assessment link (Optional)
        console.log(`Invitation sent to ${email}`);
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
        .status(204)
        .json({ message: "No invitations found for this assessment" });
    }

    res.json(invitation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invitations", error });
  }
};

// Bulk upload invitations
export const bulkUploadInvitations = [
  uplaod.single("file"), // Accept a single file with the name 'file'
  async (req, res) => {
    const { assessmentId } = req.params;

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path;
      const users = [];

      // Read the CSV file
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          if (row.email) users.push({ email: row.email });
        })
        .on("end", async () => {
          fs.unlinkSync(filePath); // Delete the uploaded file

          // Find or create the invitation record
          let invitation = await Invitation.findOne({ assessmentId });
          if (!invitation) {
            invitation = new Invitation({ assessmentId, users: [] });
          }

          // Add users to the invitation list
          users.forEach((user) => {
            if (!invitation.users.some((u) => u.email === user.email)) {
              // TODO: Send email with the assessment link
              invitation.users.push(user);
            }
          });

          await invitation.save();

          res
            .status(201)
            .json({ message: "Bulk invitation sent successfully", invitation });
        });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error processing bulk upload", error });
    }
  },
];
