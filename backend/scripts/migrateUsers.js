require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const User = require("../src/model/usermodel");
const connectDB = require("../src/db/db");

const migrateUsers = async () => {
  try {
    await connectDB();
    console.log("Running migration: Set profileCompleted for existing users...");

    const result = await User.updateMany(
      { role: { $ne: null }, profileCompleted: { $exists: false } },
      { $set: { profileCompleted: true } }
    );

    console.log(`Migration complete. Updated ${result.modifiedCount} users.`);

    const nullRoleResult = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: null, profileCompleted: false } }
    );

    if (nullRoleResult.modifiedCount > 0) {
      console.log(`Set default role=null for ${nullRoleResult.modifiedCount} users.`);
    }

    await mongoose.disconnect();
    console.log("Migration finished successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateUsers();
