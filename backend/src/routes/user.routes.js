const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const userAuth = require("../middleware/userAuth");
const roleAuth = require("../middleware/roleAuth");

// Public Routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected Routes
router.post("/logout", userAuth, userController.logoutUser);
router.get("/me", userAuth, userController.getCurrentUser);

// Optional
router.get("/getUserIdByName", userAuth, userController.getUserIdByName);
router.get("/allusers", userAuth, roleAuth("recruiter", "admin"), userController.getAllUsers);
router.delete("/delete/:id", userAuth, userController.deleteUserById);
router.post("/apply/:id", userAuth, userController.applyToJob);
router.post("/save/:id", userAuth, userController.saveJob);
module.exports = router;