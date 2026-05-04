const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// -------------------- ROOT --------------------
app.get("/", (req, res) => {
  res.send("Job Board API is running 🚀");
});

// -------------------- DATA (temporary memory) --------------------
let jobs = [];
let applications = [];

let jobIdCounter = 1;
let appIdCounter = 1;

// -------------------- JOB ROUTES --------------------

// Get all jobs
app.get("/jobs", (req, res) => {
  res.status(200).json(jobs);
});

// Get single job
app.get("/jobs/:id", (req, res) => {
  const id = Number(req.params.id);
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.status(200).json(job);
});

// Create job
app.post("/jobs", (req, res) => {
  const { title, company, location } = req.body;

  if (!title || !company || !location) {
    return res.status(400).json({
      message: "title, company, and location are required"
    });
  }

  const newJob = {
    id: jobIdCounter++,
    title,
    company,
    location,
    createdAt: new Date()
  };

  jobs.push(newJob);

  res.status(201).json({
    message: "Job created successfully",
    job: newJob
  });
});

// Update job
app.put("/jobs/:id", (req, res) => {
  const id = Number(req.params.id);
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const { title, company, location } = req.body;

  if (title !== undefined) job.title = title;
  if (company !== undefined) job.company = company;
  if (location !== undefined) job.location = location;

  res.status(200).json({
    message: "Job updated successfully",
    job
  });
});

// Delete job
app.delete("/jobs/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = jobs.findIndex(j => j.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Job not found" });
  }

  jobs.splice(index, 1);

  // Also remove related applications
  applications = applications.filter(app => app.jobId !== id);

  res.status(200).json({ message: "Job deleted successfully" });
});

// -------------------- APPLICATION ROUTES --------------------

// Apply to a job
app.post("/apply/:jobId", (req, res) => {
  const jobId = Number(req.params.jobId);
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "name and email are required"
    });
  }

  const newApplication = {
    id: appIdCounter++,
    jobId,
    name,
    email,
    appliedAt: new Date()
  };

  applications.push(newApplication);

  res.status(201).json({
    message: "Application submitted successfully",
    application: newApplication
  });
});

// Get applications for a job
app.get("/jobs/:id/applications", (req, res) => {
  const jobId = Number(req.params.id);
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const result = applications.filter(app => app.jobId === jobId);

  res.status(200).json(result);
});

// -------------------- SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});