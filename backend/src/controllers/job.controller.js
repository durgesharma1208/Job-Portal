const mongoose = require("mongoose");
const Job = require("../model/jobsmodel");
const User = require("../model/usermodel");
const Application = require("../model/applicationmodel");

const PROFILE_SELECT = "name email role avatar profileImage phone location headline about bio skills projects experience education college degree branch year resume portfolio github linkedin certificates achievements languages profileCompleted";

const arrayFields = new Set(["requirements", "skills", "benefits"]);

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.map((item) => String(item).trim()).filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
};

const normalizeJobPayload = (body = {}) => {
  const fieldMap = {
    company: "company",
    logo: "logo",
    posted: "posted",
    role: "role",
    title: "role",
    type: "type",
    jobType: "type",
    level: "level",
    experience: "level",
    salary: "salary",
    location: "location",
    description: "description",
    requirements: "requirements",
    skills: "skills",
    deadline: "deadline",
    category: "category",
    vacancies: "vacancies",
    benefits: "benefits",
  };

  const updates = {};

  for (const [incoming, target] of Object.entries(fieldMap)) {
    if (body[incoming] === undefined) continue;

    if (arrayFields.has(target)) {
      updates[target] = normalizeArray(body[incoming]);
    } else if (target === "vacancies") {
      updates[target] = body[incoming] === "" ? undefined : Number(body[incoming]);
    } else if (target === "deadline") {
      updates[target] = body[incoming] ? new Date(body[incoming]) : null;
    } else {
      updates[target] = body[incoming];
    }
  }

  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);
  return updates;
};

const serializeJob = (job) => {
  const plain = job?.toObject ? job.toObject({ virtuals: true }) : job;
  if (!plain) return null;

  return {
    ...plain,
    title: plain.role || "",
    jobType: plain.type || "",
    experience: plain.level || "",
  };
};

const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const defaultLimit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
  const limit = Math.min(Math.max(defaultLimit || 100, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const buildJobQuery = (req) => {
  const { search, type, level, location, category, company } = req.query;
  const query = {};

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    query.$or = [
      { role: regex },
      { company: regex },
      { location: regex },
      { type: regex },
      { level: regex },
      { category: regex },
      { skills: regex },
    ];
  }

  if (type) query.type = type;
  if (level) query.level = level;
  if (category) query.category = category;
  if (company) query.company = new RegExp(escapeRegex(company), "i");
  if (location) query.location = new RegExp(escapeRegex(location), "i");

  return query;
};

const canManageJob = (user, job) => {
  if (user.role === "admin") return true;
  return user.role === "recruiter" && job.postedBy?.toString() === user.id;
};

const canViewApplicants = canManageJob;

const buildApplicationRow = (application, fallbackJob = null) => ({
  _id: application._id || null,
  status: application.status || "applied",
  appliedAt: application.createdAt || null,
  student: application.student,
  job: serializeJob(application.job || fallbackJob),
});

const addJobsBulk = async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [];
    if (!payload.length) {
      return res.status(400).json({ success: false, message: "Jobs array is required." });
    }

    const jobs = payload.map((item) => ({
      ...normalizeJobPayload(item),
      postedBy: req.user.id,
    }));

    const createdJobs = await Job.insertMany(jobs);
    res.status(201).json({ success: true, jobs: createdJobs.map(serializeJob) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addJob = async (req, res) => {
  try {
    const jobData = {
      ...normalizeJobPayload(req.body),
      postedBy: req.user.id,
    };

    if (!jobData.role) {
      return res.status(400).json({ success: false, message: "Job title is required." });
    }

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, job: serializeJob(job) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const query = buildJobQuery(req);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("postedBy", "name email company")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Job.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      jobs: jobs.map(serializeJob),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const query = req.user.role === "admin" ? buildJobQuery(req) : { ...buildJobQuery(req), postedBy: req.user.id };

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("postedBy", "name email company")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Job.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      jobs: jobs.map(serializeJob),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(id)
      .populate("postedBy", "name email company")
      .lean({ virtuals: true });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job: serializeJob(job) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (!canManageJob(req.user, job)) {
      return res.status(403).json({ success: false, message: "You can only edit jobs you posted." });
    }

    const updates = normalizeJobPayload(req.body);
    const updatedJob = await Job.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("postedBy", "name email company");

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: serializeJob(updatedJob),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (!canManageJob(req.user, job)) {
      return res.status(403).json({ success: false, message: "You can only delete jobs you posted." });
    }

    await Promise.all([
      Application.deleteMany({ job: id }),
      User.updateMany(
        { $or: [{ savedJobs: id }, { appliedJobs: id }] },
        { $pull: { savedJobs: id, appliedJobs: id } }
      ),
      Job.findByIdAndDelete(id),
    ]);

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid job ID." });
    }

    const job = await Job.findById(id).lean({ virtuals: true });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (!canViewApplicants(req.user, job)) {
      return res.status(403).json({ success: false, message: "You can only view applicants for your jobs." });
    }

    const applications = await Application.find({ job: id })
      .populate("student", PROFILE_SELECT)
      .sort({ createdAt: -1 })
      .lean();

    const seenStudentIds = applications
      .filter((application) => application.student)
      .map((application) => application.student._id.toString());

    const legacyApplicants = await User.find({
      _id: { $nin: seenStudentIds },
      role: "student",
      appliedJobs: id,
    })
      .select(PROFILE_SELECT)
      .lean();

    const rows = [
      ...applications.filter((application) => application.student).map((application) => buildApplicationRow({ ...application, job })),
      ...legacyApplicants.map((student) => buildApplicationRow({ student, job, status: "applied", createdAt: null })),
    ];

    res.status(200).json({
      success: true,
      job: serializeJob(job),
      applicants: rows,
      applications: rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAccessibleApplicants = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const jobQuery = req.user.role === "admin" ? {} : { postedBy: req.user.id };
    const jobs = await Job.find(jobQuery).select("company logo posted role type level salary location postedBy").lean({ virtuals: true });
    const jobIds = jobs.map((job) => job._id);
    const jobMap = new Map(jobs.map((job) => [job._id.toString(), job]));

    if (!jobIds.length) {
      return res.status(200).json({
        success: true,
        applications: [],
        pagination: { page, limit, total: 0, totalPages: 1 },
      });
    }

    const applicationQuery = { job: { $in: jobIds } };
    const [applications, total] = await Promise.all([
      Application.find(applicationQuery)
        .populate("student", PROFILE_SELECT)
        .populate("job")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Application.countDocuments(applicationQuery),
    ]);

    const seenPairs = new Set(
      applications
        .filter((application) => application.student && application.job)
        .map((application) => `${application.student._id}:${application.job._id}`)
    );

    const legacyUsers = await User.find({ role: "student", appliedJobs: { $in: jobIds } })
      .select(PROFILE_SELECT)
      .populate({ path: "appliedJobs", match: { _id: { $in: jobIds } } })
      .limit(limit)
      .lean({ virtuals: true });

    const legacyRows = [];
    for (const student of legacyUsers) {
      for (const appliedJob of student.appliedJobs || []) {
        const pairKey = `${student._id}:${appliedJob._id}`;
        if (seenPairs.has(pairKey)) continue;
        legacyRows.push(buildApplicationRow({ student, job: jobMap.get(appliedJob._id.toString()) || appliedJob, status: "applied", createdAt: null }));
      }
    }

    const rows = [
      ...applications.filter((application) => application.student && application.job).map((application) => buildApplicationRow(application)),
      ...legacyRows,
    ].slice(0, limit);

    res.status(200).json({
      success: true,
      applications: rows,
      pagination: {
        page,
        limit,
        total: total + legacyRows.length,
        totalPages: Math.max(1, Math.ceil((total + legacyRows.length) / limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addJobsBulk = addJobsBulk;
exports.getAllJobs = getAllJobs;
exports.getMyJobs = getMyJobs;
exports.getJobById = getJobById;
exports.getJobApplicants = getJobApplicants;
exports.getAccessibleApplicants = getAccessibleApplicants;
exports.addJob = addJob;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
