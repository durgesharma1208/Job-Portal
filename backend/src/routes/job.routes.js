const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");
const userAuth = require("../middleware/userAuth");
const roleAuth = require("../middleware/roleAuth");

// Public
router.get("/", jobController.getAllJobs);
router.get("/applicants", userAuth, roleAuth("recruiter", "admin"), jobController.getAccessibleApplicants);
router.get("/mine", userAuth, roleAuth("recruiter", "admin"), jobController.getMyJobs);
router.get("/:id/applicants", userAuth, roleAuth("recruiter", "admin"), jobController.getJobApplicants);
router.get("/:id", jobController.getJobById);

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
router.put(
  "/:id",
  userAuth,
  roleAuth("recruiter", "admin"),
  jobController.updateJob
);
router.delete(
  "/:id",
  userAuth,
  roleAuth("recruiter", "admin"),
  jobController.deleteJob
);

module.exports = router;
