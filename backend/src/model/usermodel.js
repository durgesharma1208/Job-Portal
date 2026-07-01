const mongoose = require("mongoose");

const objectIdArray = {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  default: [],
};

const profileItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    organization: { type: String, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["student", "recruiter", "admin"], default: null },
  provider: { type: String, enum: ["local", "google"], default: "local" },
  googleId: { type: String, sparse: true, unique: true },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  savedJobs: { ...objectIdArray },
  appliedJobs: { ...objectIdArray },
  // Profile fields
phone: { type: String },
college: { type: String },
degree: { type: String },
branch: { type: String },
year: { type: String },
skills: [{ type: String }],
headline: { type: String, trim: true },
about: { type: String, trim: true },
projects: [profileItemSchema],
experience: [profileItemSchema],
education: [profileItemSchema],
certificates: [profileItemSchema],
achievements: [{ type: String, trim: true }],
languages: [{ type: String, trim: true }],

profileImage: {
  type: String,
  default: "",
},

profileImagePublicId: {
  type: String,
  default: "",
},

resume: {
  type: String,
  default: "",
},

resumePublicId: {
  type: String,
  default: "",
},

bio: { type: String },
location: { type: String },
github: { type: String },
linkedin: { type: String },
portfolio: { type: String },

company: { type: String },
companyLogo: { type: String },
website: { type: String },
designation: { type: String },
industry: { type: String },
companySize: { type: String },
companyDescription: { type: String },
});

userSchema.pre("validate", function () {
  for (const field of ["savedJobs", "appliedJobs"]) {
    if (Array.isArray(this[field])) {
      this[field] = this[field].filter(
        (id) => id != null && id !== "" && mongoose.Types.ObjectId.isValid(id)
      );
    } else {
      this[field] = [];
    }
  }
});

userSchema.index({ role: 1, name: 1 });
userSchema.index({ appliedJobs: 1 });
userSchema.index({ savedJobs: 1 });

module.exports = mongoose.model("user", userSchema);
