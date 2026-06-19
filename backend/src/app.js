const express = require("express");
const userSchema = require("./model/usermodel");
const Job = require("./model/jobsmodel");
const cors = require("cors");
const app = express();
const jobRoutes = require('./routes/job.routes');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // Frontend ka URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
// Ek basic route add karein taaki server chalne ka pata chale
app.get("/", (req, res) => {
  res.send("Server is running!");
});
// User routes

app.use('/api/user', userRoutes);
// Job routes
app.use('/api/job', jobRoutes);


module.exports = app;