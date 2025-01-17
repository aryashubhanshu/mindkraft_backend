import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assessment",
    required: true,
  },
  users: [
    {
      email: { type: String, required: true },
      status: { type: String, default: "invited" }, // invited or submitted
      invitedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Invitation", invitationSchema);
