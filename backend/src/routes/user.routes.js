const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const userAuth = require("../middleware/userAuth");
const roleAuth = require("../middleware/roleAuth");
const upload = require("../middleware/upload");
// Public Routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected Routes
router.post("/logout", userAuth, userController.logoutUser);
router.get("/me", userAuth, userController.getCurrentUser);
router.patch("/role", userAuth, userController.updateRole);
router.patch(
  "/profile",
  userAuth,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  userController.updateProfile
);

// Optional
router.get("/getUserIdByName", userAuth, userController.getUserIdByName);
router.get("/profile/:id", userAuth, userController.getUserProfileById);
router.get("/allusers", userAuth, roleAuth("admin"), userController.getAllUsers);
router.delete("/delete/:id", userAuth, roleAuth("admin"), userController.deleteUserById);
router.post("/apply/:id", userAuth, roleAuth("student", "admin"), userController.applyToJob);
router.post("/save/:id", userAuth, roleAuth("student", "admin"), userController.saveJob);
module.exports = router;
