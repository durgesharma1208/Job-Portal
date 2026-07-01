const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true },
    logo: { type: String, trim: true },
    posted: { type: String, default: "Just now" },
    role: { type: String, trim: true, alias: "title" },
    type: { type: String, trim: true, alias: "jobType" },
    level: { type: String, trim: true, alias: "experience" },
    salary: { type: String, trim: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    deadline: { type: Date },
    category: { type: String, trim: true },
    vacancies: { type: Number, min: 0 },
    benefits: [{ type: String, trim: true }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.index({ role: "text", company: "text", location: "text", skills: "text", category: "text" });
jobSchema.index({ postedBy: 1, createdAt: -1 });
jobSchema.index({ type: 1, level: 1, location: 1 });

module.exports = mongoose.model("Job", jobSchema);
