const mongoose = require("mongoose");
const User = require("../model/usermodel");
const Job = require("../model/jobsmodel");
const Application = require("../model/applicationmodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");

const PROFILE_SELECT = "-password -googleId -profileImagePublicId -resumePublicId";

const arrayProfileFields = new Set([
  "skills",
  "projects",
  "experience",
  "education",
  "certificates",
  "achievements",
  "languages",
]);

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeArrayValue = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
};

const normalizeProfileValue = (field, value) => {
  if (!arrayProfileFields.has(field)) return value;
  return normalizeArrayValue(value);
};

const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
};

const calculateProfileCompletion = (user) => {
  const profile = user?.toObject ? user.toObject() : user || {};
  const fieldsByRole = {
    student: ["name", "email", "phone", "location", "headline", "bio", "skills", "resume", "portfolio", "github", "linkedin"],
    recruiter: ["name", "email", "phone", "location", "company", "designation", "industry", "website", "linkedin", "companyDescription"],
    admin: ["name", "email", "role"],
  };
  const fields = fieldsByRole[profile.role] || fieldsByRole.student;
  const completed = fields.filter((field) => hasValue(profile[field])).length;
  return Math.round((completed / fields.length) * 100);
};

const serializeProfile = (user, application = null) => {
  const profile = user?.toObject ? user.toObject() : user;
  if (!profile) return null;

  delete profile.password;
  delete profile.googleId;
  delete profile.profileImagePublicId;
  delete profile.resumePublicId;

  return {
    ...profile,
    photo: profile.profileImage || profile.avatar || "",
    headline: profile.headline || profile.designation || "",
    about: profile.about || profile.bio || profile.companyDescription || "",
    profileCompletion: calculateProfileCompletion(profile),
    appliedDate: application?.createdAt || null,
    applicationStatus: application?.status || null,
  };
};

const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const canRecruiterViewStudent = async (recruiterId, studentId) => {
  const ownedJobIds = await Job.find({ postedBy: recruiterId }).distinct("_id");
  if (!ownedJobIds.length) return false;

  const application = await Application.exists({
    student: studentId,
    job: { $in: ownedJobIds },
  });
  if (application) return true;

  const legacyApplication = await User.exists({
    _id: studentId,
    role: "student",
    appliedJobs: { $in: ownedJobIds },
  });

  return Boolean(legacyApplication);
};

const sendUserList = async (req, res, fixedRole = null) => {
  const { page, limit, skip } = getPagination(req);
  const { search, role } = req.query;
  const query = {};

  if (fixedRole) {
    query.role = fixedRole;
  } else if (["student", "recruiter", "admin"].includes(role)) {
    query.role = role;
  }

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    query.$or = [
      { name: regex },
      { email: regex },
      { location: regex },
      { company: regex },
      { college: regex },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select(PROFILE_SELECT)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    users: users.map((user) => ({
      ...user,
      savedJobsCount: user.savedJobs?.length || 0,
      appliedJobsCount: user.appliedJobs?.length || 0,
      profileCompletion: calculateProfileCompletion(user),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
};
// ===============================
// REGISTER USER
// ===============================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
      savedJobs: [],
      appliedJobs: [],
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===============================
// LOGIN USER
// ===============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account uses Google sign-in. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    if (role && user.role !== role) {
      return res.status(400).json({
        success: false,
        message: `Account exists, but not with the role of a ${role}.`
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===============================
// LOGOUT USER
// ===============================
exports.logoutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful",
    });
};

// ===============================
// GET CURRENT USER
// ===============================
// ===============================
// GET CURRENT USER (💥 FIXED WITH POPULATE)
// ===============================
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user.id se directly db hit karke populate kiya taaki frontend ko full array objects milein
    const user = await User.findById(req.user.id)
      .populate("savedJobs")
      .populate("appliedJobs")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const applications = req.user.role === "student"
      ? await Application.find({ student: req.user.id })
        .populate("job")
        .sort({ createdAt: -1 })
        .lean()
      : [];

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        applications,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===============================
// GET USER ID BY NAME
// ===============================
exports.getUserIdByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await User.findOne({
      name: {
        $regex: new RegExp(
          `^${name.trim()}$`,
          "i"
        ),
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===============================
// GET ALL USERS
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    await sendUserList(req, res);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// controllers/jobController.js ya userController.js

exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    if (!["student", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Only students can apply to jobs." });
    }

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid job ID." });
    }

    const [user, job] = await Promise.all([
      User.findById(userId),
      Job.findById(jobId).select("_id"),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const alreadyApplied = (user.appliedJobs || []).some((id) => id.toString() === jobId);
    const existingApplication = await Application.exists({ student: userId, job: jobId });

    if (alreadyApplied || existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job."
      });
    }

    const application = await Application.create({
      student: userId,
      job: jobId,
      status: "applied",
    });

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { appliedJobs: jobId } },
      { returnDocument: 'after' }
    );

    return res.status(200).json({
      success: true,
      message: "Applied to job successfully!",
      application,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already applied to this job." });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    if (!["student", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Only students can save jobs." });
    }

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid job ID." });
    }

    const [user, job] = await Promise.all([
      User.findById(userId),
      Job.findById(jobId).select("_id"),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const savedJobsArray = user.savedJobs || [];
    if (savedJobsArray.some((id) => id.toString() === jobId)) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { savedJobs: jobId } },
        { returnDocument: 'after' }
      );

      return res.status(200).json({
        success: true,
        message: "Job unsaved successfully!"
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedJobs: jobId } },
      { returnDocument: 'after' }
    );

    return res.status(200).json({
      success: true,
      message: "Job saved successfully!"
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// ===============================
// UPDATE USER ROLE
// ===============================
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["student", "recruiter"];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed values: student, recruiter",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { role, profileCompleted: false },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===============================
// UPDATE USER PROFILE
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    const { role } = req.user;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Please select a role before completing your profile",
      });
    }

    const allowedFieldsByRole = {
      student: [
        "phone",
        "college",
        "degree",
        "branch",
        "year",
        "skills",
        "resume",
        "bio",
        "headline",
        "about",
        "projects",
        "experience",
        "education",
        "certificates",
        "achievements",
        "languages",
        "location",
        "github",
        "linkedin",
        "portfolio",
        "name",
        "avatar",
      ],
      recruiter: [
        "company",
        "companyLogo",
        "website",
        "designation",
        "industry",
        "companySize",
        "companyDescription",
        "phone",
        "linkedin",
        "location",
        "name",
        "avatar",
      ],
      admin: ["phone", "linkedin", "location", "name", "avatar"],
    };

    const allowedFields = allowedFieldsByRole[role] || [];

    const currentUser = await User.findById(req.user.id).select("profileImagePublicId resumePublicId");

    const updates = {};

    if (req.files?.profileImage?.length > 0) {
      const file = req.files.profileImage[0];
      if (currentUser?.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(currentUser.profileImagePublicId, { resource_type: "image" });
        } catch (err) {
          console.error("Failed to delete old profile image from Cloudinary:", err.message);
        }
      }
      const b64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(b64, {
        folder: "job-portal/profile-images",
        resource_type: "image",
      });
      updates.profileImage = result.secure_url;
      updates.profileImagePublicId = result.public_id;
    }

    if (req.files?.resume?.length > 0) {
      const file = req.files.resume[0];
      if (currentUser?.resumePublicId) {
        try {
          await cloudinary.uploader.destroy(currentUser.resumePublicId, { resource_type: "raw" });
        } catch (err) {
          console.error("Failed to delete old resume from Cloudinary:", err.message);
        }
      }
      const b64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(b64, {
        folder: "job-portal/resumes",
        resource_type: "raw",
      });
      updates.resume = result.secure_url;
      updates.resumePublicId = result.public_id;
    }

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = normalizeProfileValue(field, req.body[field]);
      }
    }

    updates.profileCompleted = true;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error.message || error);
    if (error.stack) console.error(error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    const profileUser = await User.findById(id).select(PROFILE_SELECT);
    if (!profileUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let application = null;

    if (req.user.role === "student") {
      if (req.user.id !== id) {
        return res.status(403).json({ success: false, message: "You can only view your own profile." });
      }
    } else if (req.user.role === "recruiter") {
      if (profileUser.role !== "student") {
        return res.status(403).json({ success: false, message: "Recruiters can only view applicant profiles." });
      }

      const canView = await canRecruiterViewStudent(req.user.id, id);
      if (!canView) {
        return res.status(403).json({ success: false, message: "This student has not applied to your jobs." });
      }

      const ownedJobIds = await Job.find({ postedBy: req.user.id }).distinct("_id");
      application = await Application.findOne({ student: id, job: { $in: ownedJobIds } })
        .sort({ createdAt: -1 })
        .lean();
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      profile: serializeProfile(profileUser, application),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAdminUsers = async (req, res) => {
  try {
    await sendUserList(req, res);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAdminStudents = async (req, res) => {
  try {
    await sendUserList(req, res, "student");
  } catch (error) {
    console.error("Admin students error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAdminRecruiters = async (req, res) => {
  try {
    await sendUserList(req, res, "recruiter");
  } catch (error) {
    console.error("Admin recruiters error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getApplicationStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID." });
    }

    const application = await Application.findById(id)
      .populate("student", PROFILE_SELECT)
      .populate("job")
      .lean();

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (!application.student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (req.user.role === "recruiter") {
      if (!application.job || application.job.postedBy?.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "You can only view applicants for your jobs." });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      student: serializeProfile(application.student, application),
      application: {
        _id: application._id,
        status: application.status,
        appliedAt: application.createdAt,
        job: application.job,
      },
    });
  } catch (error) {
    console.error("Get application student error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Promise.all([
      Application.deleteMany({ student: id }),
      User.findByIdAndDelete(id),
    ]);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};  
