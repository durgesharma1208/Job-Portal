const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");

const userAuth = async (req, res, next) => {
  try {
    // Cookie se token lo
    const token = req.cookies.token;

    // Token nahi mila
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // Token verify karo
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // User find karo
    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Request me user store karo
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = userAuth;