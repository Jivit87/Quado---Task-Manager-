const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Connecting MongoDB
connectDB();

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/auth", authRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/ai", aiRoutes);

// For error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.get("/", (req, res) => {
  res.send("Task Management API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
