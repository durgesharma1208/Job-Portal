const express = require('express');
const Job = require('../model/jobsmodel');
const User = require('../model/usermodel'); 

const addJobsBulk = async (req, res) => {
    try {
        const jobs = await Job.insertMany(req.body);
        res.status(201).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const addJob=async(req,res)=>{

    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const saveJobForUser = async (req, res) => {
    const { jobId } = req.params;
    const { userId } = req.body; // Cleaner destructuring

    try {
        // Verify if user exists first to prevent silent failures
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedJobs: jobId } },
            { new: true }
        ).populate("savedJobs"); // Optional: Populates so frontend receives the updated job data instantly

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clean modern exports
exports.addJobsBulk = addJobsBulk;
exports.getAllJobs = getAllJobs;
exports.addJob = addJob;
exports.saveJobForUser = saveJobForUser;