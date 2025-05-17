const Task = require('../models/Task');
const { startOfDay, endOfDay, isToday, isBefore } = require('date-fns');

exports.getAnalytics = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated',
        error: 'Missing user in request'
      });
    }

    // Getting all task from user
    let tasks;
    try {
      tasks = await Task.find({ user: req.user.id }).lean();
    } catch (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Calc. summary statistics
    try {
      const summary = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.status === 'Completed').length,
        pendingTasks: tasks.filter(task => task.status === 'Pending').length,
        overdueTasks: tasks.filter(task => {
          if (!task.dueDate) return false;
          try {
            const taskDate = new Date(task.dueDate);
            return isBefore(taskDate, new Date()) && task.status !== 'Completed';
          } catch (dateError) {
            return false;
          }
        }).length,
        dueToday: tasks.filter(task => {
          if (!task.dueDate) return false;
          try {
            const taskDate = new Date(task.dueDate);
            return isToday(taskDate) && task.status !== 'Completed';
          } catch (dateError) {
            return false;
          }
        }).length
      };

      // Get tasks by date (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const tasksByDate = tasks
        .filter(task => {
          if (!task.dueDate) return false;
          try {
            const taskDate = new Date(task.dueDate);
            return taskDate >= thirtyDaysAgo;
          } catch (dateError) {
            return false;
          }
        })
        .reduce((acc, task) => {
          try {
            const date = new Date(task.dueDate).toISOString().split('T')[0];
            if (!acc[date]) {
              acc[date] = { date, completed: 0, added: 0 };
            }
            if (task.status === 'Completed') {
              acc[date].completed++;
            }
            acc[date].added++;
            return acc;
          } catch (dateError) {
            return acc;
          }
        }, {});

      // Convert tasksByDate object to array and sort by date
      const tasksByDateArray = Object.values(tasksByDate).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      // Get status breakdown
      const statusBreakdown = Object.entries(
        tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {})
      ).map(([status, count]) => ({ status, count }));

      // Get category breakdown
      const categoryBreakdown = Object.entries(
        tasks.reduce((acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        }, {})
      ).map(([category, count]) => ({ category, count }));

      // Get upcoming deadlines (next 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const upcomingDeadlines = tasks
        .filter(task => {
          if (!task.dueDate) return false;
          try {
            const taskDate = new Date(task.dueDate);
            return taskDate >= new Date() && 
                   taskDate <= sevenDaysFromNow && 
                   task.status !== 'Completed';
          } catch (dateError) {
            return false;
          }
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

      // Generating AI insights based on task data
      const aiInsights = generateAIInsights(tasks, summary);

      const response = {
        success: true,
        data: {
          summary,
          tasksByDate: tasksByDateArray,
          statusBreakdown,
          categoryBreakdown,
          upcomingDeadlines,
          aiInsights
        }
      };

      res.json(response);
    } catch (calcError) {
      throw new Error(`Error calculating analytics: ${calcError.message}`);
    }
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Helper function to generate AI insights
const generateAIInsights = (tasks, summary) => {
  const insights = [];

  // Completion rate insight
  const completionRate = (summary.completedTasks / summary.totalTasks) * 100;
  if (completionRate < 50) {
    insights.push("Your task completion rate is below 50%. Consider breaking down larger tasks into smaller, more manageable pieces.");
  } else if (completionRate > 80) {
    insights.push("Great job! You're maintaining a high task completion rate. Keep up the good work!");
  }

  // Overdue tasks insight
  if (summary.overdueTasks > 0) {
    insights.push(`You have ${summary.overdueTasks} overdue tasks. Consider reviewing and reprioritizing these tasks.`);
  }

  // Due today insight
  if (summary.dueToday > 0) {
    insights.push(`You have ${summary.dueToday} tasks due today. Focus on completing these first.`);
  }

  // Category distribution insight
  const categoryDistribution = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const maxCategory = Object.entries(categoryDistribution)
    .sort((a, b) => b[1] - a[1])[0];

  if (maxCategory) {
    insights.push(`Most of your tasks (${maxCategory[1]}) are in the "${maxCategory[0]}" category. Consider balancing your workload across different categories.`);
  }

  return insights;
};

exports.exportTasksData = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    
    // Convert tasks to CSV format
    const csvHeader = 'Title,Description,Category,Status,Due Date,Created At\n';
    const csvRows = tasks.map(task => {
      return `"${task.title}","${task.description}","${task.category}","${task.status}","${task.dueDate}","${task.createdAt}"`;
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks-export.csv');
    
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 