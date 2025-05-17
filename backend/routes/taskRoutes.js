const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const {
  getAnalytics,
  exportTasksData,
} = require('../controllers/analyticsController');

router.get('/analytics', protect, getAnalytics);
router.get('/export', protect, exportTasksData);

// Task Routes
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;