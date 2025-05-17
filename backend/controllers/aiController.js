const { getGeminiModel } = require("../config/gemini");
const Task = require("../models/Task");

const suggestPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found" 
      });
    }

    if (!task.dueDate) {
      return res.status(400).json({
        success: false,
        message: "Task must have a due date for priority suggestion"
      });
    }

    const model = getGeminiModel();
    
    // Calculate days until due
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const timeLeft = dueDate - today;
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    const prompt = `
    Based on this task information, suggest an appropriate priority level (High, Medium, or Low):
    - Title: ${task.title}
    - Description: ${task.description}
    - Due date: ${task.dueDate} (${daysLeft} days from now)
    - Category: ${task.category}
    
    Provide only the suggested priority level and a brief 1-sentence explanation.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return res.json({ 
      success: true,
      suggestion: response 
    });
  } catch (error) {
    console.error("Error suggesting priority:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message || "Failed to generate priority suggestion"
    });
  }
};

const generateDailyPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Generating daily plan for user:", userId);

    const tasks = await Task.find({ user: userId }).sort({ dueDate: 1 });
    console.log("Found tasks:", tasks.length);
    
    if (tasks.length === 0) {
      return res.json({ 
        success: true,
        plan: "No tasks available for planning. Add some tasks to get a personalized daily plan." 
      });
    }

    try {
      const model = getGeminiModel();
      console.log("Gemini model initialized successfully");
      
      // Create a task list for the prompt
      const taskList = tasks.map((task, index) => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        return `${index + 1}. ${task.title} - Due in ${daysLeft} days - Status: ${task.status} - Priority: ${task.priority || 'Undefined'}`;
      }).join('\n');
      
      const prompt = `
      Based on these tasks, create an optimal daily plan selecting 3-4 most important tasks. 
      Format the output as a schedule with specific time slots.
      
      Current Tasks:
      ${taskList}
      
      Provide a schedule in the following format (use emoji checkboxes):
      ✅ [Time] – [Task]
      ✅ [Time] – [Task]
      ✅ [Time] – [Task]
      `;
      
      console.log("Sending prompt to Gemini");
      const result = await model.generateContent(prompt);
      console.log("Received response from Gemini");
      const plan = result.response.text();
      
      return res.json({ 
        success: true,
        plan 
      });
    } catch (geminiError) {
      console.error("Gemini API Error:", {
        name: geminiError.name,
        message: geminiError.message,
        stack: geminiError.stack,
        details: geminiError.details || 'No additional details'
      });
      throw geminiError; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error("Error generating daily plan:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.details || 'No additional details'
    });
    return res.status(500).json({ 
      success: false,
      message: error.message || "Failed to generate daily plan",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


const getTaskInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current date and date 7 days ago
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    // Get completed tasks in the last week
    const completedTasks = await Task.find({
      user: userId,
      status: "Completed",
      updatedAt: { $gte: oneWeekAgo }
    });
    
    // Get overdue tasks
    const overdueTasks = await Task.find({
      user: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: today }
    });
    
    // Get upcoming tasks for the next week
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingTasks = await Task.find({
      user: userId,
      status: { $ne: "Completed" },
      dueDate: { $gte: today, $lte: nextWeek }
    });
    
    if (completedTasks.length === 0 && overdueTasks.length === 0 && upcomingTasks.length === 0) {
      return res.json({
        success: true,
        stats: {
          completedWeekly: 0,
          overdue: 0,
          upcoming: 0
        },
        insights: "No task data available for insights. Start adding tasks to get personalized insights."
      });
    }

    const model = getGeminiModel();
    
    // Prepare prompt for Gemini
    const prompt = `
    Based on this task data, provide 2-3 insightful observations and productivity tips:
    - Completed tasks in the last week: ${completedTasks.length}
    - Overdue tasks: ${overdueTasks.length}
    - Upcoming tasks due this week: ${upcomingTasks.length}
    
    Format the response as bullet points with helpful observations and actionable advice.
    `;
    
    const result = await model.generateContent(prompt);
    const insights = result.response.text();
    
    return res.json({ 
      success: true,
      stats: {
        completedWeekly: completedTasks.length,
        overdue: overdueTasks.length,
        upcoming: upcomingTasks.length
      },
      insights
    });
  } catch (error) {
    console.error("Error generating task insights:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message || "Failed to generate task insights"
    });
  }
};

// Get motivational quote
const getMotivationalQuote = async (req, res) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `
    Generate a short, motivational quote about productivity.
    The quote should be inspiring and help someone stay motivated with their tasks.
    Format it as: "Quote text" 
    
    Keep it under 20 words total and different everytime.
    `;
    
    const result = await model.generateContent(prompt);
    const quote = result.response.text();
    
    return res.json({ 
      success: true,
      quote 
    });
  } catch (error) {
    console.error("Error generating quote:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message || "Failed to generate motivational quote"
    });
  }
};

// Get weekly focus suggestion based on past tasks
const getWeeklyFocusSuggestion = async (req, res) => {
  try {
    // Get tasks from the last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const tasks = await Task.find({
      user: req.user._id,
      createdAt: { $gte: lastWeek }
    });

    // Analyze task categories/tags
    const categoryCount = {};
    tasks.forEach(task => {
      if (task.category) {
        categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
      }
    });

    // Find most frequent category
    let mostFrequentCategory = null;
    let maxCount = 0;
    for (const [category, count] of Object.entries(categoryCount)) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentCategory = category;
      }
    }

    // Generate suggestion using Gemini
    const model = getGeminiModel();
    const prompt = `Based on the user's task history, they completed ${maxCount} tasks in the "${mostFrequentCategory}" category last week. 
    Generate a friendly, encouraging suggestion for them to focus on this category again this week. 
    Keep it concise and actionable. Format: "Last week, you did X tasks in [category]. Want to focus on [category] this week?"`;

    const result = await model.generateContent(prompt);
    const suggestion = result.response.text();

    res.json({
      suggestion,
      category: mostFrequentCategory,
      count: maxCount
    });
  } catch (error) {
    console.error("Error getting weekly focus suggestion:", error);
    res.status(500).json({ message: "Failed to generate weekly focus suggestion" });
  }
};

module.exports = {
  suggestPriority,
  generateDailyPlan,
  getTaskInsights,
  getMotivationalQuote,
  getWeeklyFocusSuggestion
};