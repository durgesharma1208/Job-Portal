const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");
const userAuth = require("../middleware/userAuth");
const roleAuth = require("../middleware/roleAuth");

// Public
router.get("/", jobController.getAllJobs);

// Recruiter/Admin Only
router.post(
  "/bulk",
  userAuth,
  roleAuth("recruiter", "admin"),
  jobController.addJobsBulk
);
router.post(
  "/",
  userAuth,
  roleAuth("recruiter", "admin"),
  jobController.addJob
);

// Student Only
router.post(
  "/save/:jobId",
  userAuth,
  roleAuth("student"),
  jobController.saveJobForUser
);

module.exports = router;