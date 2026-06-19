const app = require("./src/app");
const dns = require("dns");
const connectDB = require("./src/db/db");
require("dotenv").config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Connect to MongoDB
connectDB();

// Yaha listen call karna zaroori hai
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});