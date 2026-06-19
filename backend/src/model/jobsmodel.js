const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: String,
  logo: String,
  posted: String,
  role: String,
  type: String,
  level: String,
  salary: String,
  location: String,
  
}); // Isse createdAt aur updatedAt apne aap ban jayenge

module.exports = mongoose.model("Job", jobSchema);