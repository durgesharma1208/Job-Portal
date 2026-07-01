const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const userAuth = require("../middleware/userAuth");
const roleAuth = require("../middleware/roleAuth");

router.get("/users", userAuth, roleAuth("admin"), userController.getAdminUsers);
router.get("/students", userAuth, roleAuth("admin"), userController.getAdminStudents);
router.get("/recruiters", userAuth, roleAuth("admin"), userController.getAdminRecruiters);

module.exports = router;
