import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  userGroup: { type: [String], required: true },
  timeLimit: { type: Number, required: true },
  questions: [
    {
      text: { type: String, required: true },
      options: [
        {
          text: { type: String, required: true },
          weightage: { type: Number, required: true },
        },
      ], // e.g. ["Option 1", "Option 2", "Option 3", "Option 4"]
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },

  // Submissions
  submissions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      answers: [{ type: String, required: true }],
      submittedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Assessment", assessmentSchema);
