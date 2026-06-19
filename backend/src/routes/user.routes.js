const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const userAuth = require("../middleware/userAuth");

// Public Routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected Routes
router.post("/logout", userAuth, userController.logoutUser);
router.get("/me", userAuth, userController.getCurrentUser);

// Optional
router.get("/getUserIdByName", userAuth, userController.getUserIdByName);
router.get("/allusers", userAuth, userController.getAllUsers);
router.delete("/delete/:id", userAuth, userController.deleteUserById);
module.exports = router;