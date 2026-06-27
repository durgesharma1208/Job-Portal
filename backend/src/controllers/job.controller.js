const express = require('express');
const Job = require('../model/jobsmodel');

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

// Clean modern exports
exports.addJobsBulk = addJobsBulk;
exports.getAllJobs = getAllJobs;
exports.addJob = addJob;