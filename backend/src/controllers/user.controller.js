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
    const { email, password } = req.body;

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
exports.getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
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
    const users = await User.find({}, { password: 0 });

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