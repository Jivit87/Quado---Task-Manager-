const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  category: {
    type: String,
    enum: ['Personal', 'Work', 'Urgent', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
}, {
  timestamps: true
});

// Middleware to set completedAt date when status changes to Completed
TaskSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "Completed" &&
    !this.completedAt
  ) {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', TaskSchema);
