const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const userAuth = require("../middleware/userAuth");
const roleAuth = require("../middleware/roleAuth");

router.get("/:id/student", userAuth, roleAuth("recruiter", "admin"), userController.getApplicationStudent);

module.exports = router;
