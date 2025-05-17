import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle logging
api.interceptors.response.use(
  (response) => {
    // Only log non sensitive information
    if (response.config.url.includes("/dashboard")) {
      console.log("Dashboard data fetched successfully");
    } else {
      console.log(`API call to ${response.config.url} successful`);
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

export const getTasks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.category) queryParams.append("category", filters.category);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.dueDate) queryParams.append("dueDate", filters.dueDate);

    const query = queryParams.toString();
    const response = await api.get(`/tasks${query ? `?${query}` : ""}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const getTask = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const getDashboardData = async () => {
  try {
    const response = await api.get("/tasks/dashboard");
    const { data } = response.data;

    // Process and sanitize the data before returning
    const sanitizedData = {
      summary: {
        totalTasks: data.summary.totalTasks,
        completedTasks: data.summary.completedTasks,
        pendingTasks: data.summary.pendingTasks,
        overdueTasks: data.summary.overdueTasks,
        dueToday: data.summary.dueToday,
      },
      tasksByDate: data.tasksByDate.map((item) => ({
        date: item.date,
        completed: item.completed,
        added: item.added,
      })),
      statusBreakdown: data.statusBreakdown,
      categoryBreakdown: data.categoryBreakdown,
      upcomingDeadlines: data.upcomingDeadlines.map((task) => ({
        id: task._id,
        title: task.title,
        dueDate: task.dueDate,
        category: task.category,
        status: task.status,
      })),
      aiInsights: data.aiInsights,
    };

    return sanitizedData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch dashboard data";
    throw new Error(errorMessage);
  }
};

export default {
  api,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDashboardData,
};
