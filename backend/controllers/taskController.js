const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const { category, status, dueDate } = req.query;
    
    const filter = { user: req.user.id };
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (dueDate) {
      const startDate = new Date(dueDate);
      const endDate = new Date(dueDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.dueDate = { $gte: startDate, $lt: endDate };
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, category, status } = req.body;
    
    const newTask = new Task({
      title,
      description,
      dueDate,
      category,
      status,
      user: req.user.id
    });
    
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, category, status } = req.body;
    
    const taskFields = {};
    if (title !== undefined) taskFields.title = title;
    if (description !== undefined) taskFields.description = description;
    if (dueDate !== undefined) taskFields.dueDate = dueDate;
    if (category !== undefined) taskFields.category = category;
    if (status !== undefined) taskFields.status = status;
    
    let task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );
    
    res.json(task);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};