const mongoose = require("mongoose");

// Step 1: Schema define karein
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "recruiter", "admin"], required: true },
  // Array of Job IDs that this specific user saved
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }], 
  
  // Array of Job IDs that this specific user applied to
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
});

// Step 2 & 3: Model compile karke export karein
module.exports = mongoose.model("user", userSchema);