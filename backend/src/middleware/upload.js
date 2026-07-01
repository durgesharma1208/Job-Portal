const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Invalid image type. Allowed: JPG, PNG, WebP"));
      }
    }

    if (file.fieldname === "resume") {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Invalid resume type. Allowed: PDF, DOC, DOCX"));
      }
    }

    cb(null, true);
  },
});

module.exports = upload;