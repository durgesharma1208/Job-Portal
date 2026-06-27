const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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

    res.status(200).json({
      success: true,
      user,
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
   const users = await User.find({})
      .populate("savedJobs")
      .populate("appliedJobs")
      .select("-password");

    res.status(200).json({
      success: true,
      users: users,
    });
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
    const jobId = req.params.id; // URL se Job ID li (e.g., /apply/:id)
    const userId = req.user.id;  // Auth Middleware (userAuth) se logged-in user ki ID li

    // 1. Check karo ki kya user ne is job par pehle se apply toh nahi kiya hua hai
    const user = await User.findById(userId);
    if (user.appliedJobs.includes(jobId)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job."
      });
    }

    // 2. 💥 CRITICAL: MongoDB `$push` operator se array me raw Job ID insert karo
    await User.findByIdAndUpdate(
      userId,
      { $push: { appliedJobs: jobId } }, // appliedJobs array me jobId add ho jayegi
    { returnDocument: 'after' }
    );

    return res.status(200).json({
      success: true,
      message: "Applied to job successfully! 🎉"
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.saveJob = async (req, res) => {
  try {
    const jobId = req.params.id; 
    const userId = req.user.id;  

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 💥 FIX 1: Safe Array Access (Agar field nahi bhi hogi toh [] use karega, crash nahi hoga)
    const savedJobsArray = user.savedJobs || []; 
if (savedJobsArray.includes(jobId)) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { savedJobs: jobId } }, // 🟢 $pull operator array se ID ko delete kar dega
        { returnDocument: 'after' }
      );
      
      return res.status(200).json({
        success: true,
        message: "Job unsaved successfully! ❌"
      });
    }

    // 💥 FIX 2: Deprecation Warning hatane ke liye { returnDocument: 'after' } use kiya
    await User.findByIdAndUpdate(
      userId,
      { $push: { savedJobs: jobId } }, 
      { returnDocument: 'after' } 
    );

    return res.status(200).json({
      success: true,
      message: "Job saved successfully! 🎉"
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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