const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["applied", "review", "shortlisted", "rejected", "hired"],
      default: "applied",
      index: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, createdAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);
