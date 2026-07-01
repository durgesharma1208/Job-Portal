const roleAuth = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!req.user.profileCompleted && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Please complete your profile first",
      });
    }

    next();
  };
};

module.exports = roleAuth;