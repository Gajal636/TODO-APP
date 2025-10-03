// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(cors({
  origin: "https://todo-app-my-app.onrender.com", // frontend origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect("mongodb+srv://Gajal636:24bcs192@cluster0.rurfwhi.mongodb.net/todoApp?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema({
  kyaTaskHai: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});
const Task = mongoose.model("Task", taskSchema);

// Middleware to check JWT
const authenticate = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Cookie configuration for production
const cookieOptions = {
  httpOnly: true,
  secure: true, // Required for HTTPS
  sameSite: "none", // Required for cross-origin
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Todo App Backend is running! 🚀" });
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id, name: user.name }, "secret_key", { expiresIn: "1d" });
    res.cookie("jwt", token, cookieOptions);
    res.json({ success: true, user: { _id: user._id, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("jwt", cookieOptions);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Get tasks
app.get("/viewTask", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Add task
app.post("/addTask", authenticate, async (req, res) => {
  try {
    const { taskValue } = req.body;
    if (!taskValue) throw new Error("taskValue is required");

    const task = await Task.create({ kyaTaskHai: taskValue, userId: req.user._id });
    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete task
app.delete("/deleteTask/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
