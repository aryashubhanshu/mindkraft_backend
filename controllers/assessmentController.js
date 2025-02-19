import Assessment from "../models/Assessment.js";

// Create a new assessment
export const createAssessment = async (req, res) => {
  try {
    const { name, type, userGroup, timeLimit, questions } = req.body;

    const newAssessment = new Assessment({
      name,
      type,
      userGroup,
      timeLimit,
      questions,
      // TODO
      createdBy: req.user.id, // available from middleware
    });

    await newAssessment.save();
    res.status(201).json({
      message: "Assessment created successfully",
      assessment: newAssessment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating assessment", error });
  }
};

// Get all assessments
export const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ createdBy: req.user.id });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assessments", error });
  }
};

// Get a specific assessment by ID
export const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assessment", error });
  }
};

// Get a specific assessment by ID (for user)
export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    // Find the assessment by ID
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Check if the user has already submitted this assessment
    const hasSubmitted = assessment.submissions.some(
      (sub) => sub.userId.toString() === userId
    );

    if (hasSubmitted) {
      return res.status(200).json({
        message: "You have already completed this assessment.",
        submitted: true,
      });
    }

    // If not submitted, return the assessment details
    res.status(200).json({
      submitted: false,
      assessment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assessment", error });
  }
};

// Update an assessment
export const updateAssessment = async (req, res) => {
  try {
    const { name, type, userGroup, timeLimit, questions } = req.body;
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { name, type, userGroup, timeLimit, questions },
      { new: true }
    );
    if (!updatedAssessment) {
      res.status(404).json({ message: "Assessment not found" });
    }
    res.json({
      message: "Assessment updated successfully",
      assessment: updatedAssessment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating assessment", error });
  }
};

// Delete an assessment
export const deleteAssessment = async (req, res) => {
  try {
    const deletedAssessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!deletedAssessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    res.json({ message: "Assessment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assessment", error });
  }
};

// Record a submission
export const recordSubmission = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userId = req.user.id; // User ID from middleware
    const { answers } = req.body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      res.status(404).json({ message: "Assessment not found" });
    }

    const alreadySubmitted = assessment.submissions.some(
      (submission) => submission.userId.toString() === userId
    );
    if (alreadySubmitted) {
      return res
        .status(400)
        .json({ message: "User has already submitted this assessment" });
    }

    if (!answers || answers.length !== assessment.questions.length) {
      return res
        .status(400)
        .json({ message: "All questions must be answered." });
    }

    assessment.submissions.push({ userId, answers, submittedAt: new Date() });
    await assessment.save();

    res.status(201).json({ message: "Submission recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error recording submission", error });
  }
};

export const getUserSubmission = async (req, res) => {
  try {
    const { assessmentId, userId } = req.params; // Get assessmentId and userId from request params

    // Find the assessment along with the user's submission
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Find the user's submission
    const submission = assessment.submissions.find(
      (sub) => sub.userId.toString() === userId
    );

    if (!submission) {
      return res
        .status(404)
        .json({ message: "Submission not found for this user" });
    }

    // Structure response to include questions, options, and user's selected answers
    const formattedQuestions = assessment.questions.map((question, index) => ({
      text: question.text,
      options: question.options.map((option) => ({
        text: option.text,
        weightage: option.weightage,
      })),
      selectedAnswer: submission.answers[index] || null, // Fetch user's selected answer
    }));

    res.status(200).json({
      assessmentName: assessment.name,
      userId,
      submittedAt: submission.submittedAt,
      questions: formattedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user submission", error });
  }
};
