import axios from "axios";

// Create axios instance with better configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor with better token handling
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    try {
      // Validate response data
      if (!response.data) {
        throw new Error("No data received from server");
      }
      return response;
    } catch (error) {
      console.error("Response validation error:", error);
      return Promise.reject(error);
    }
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log the error details
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: originalRequest?.url
    });

    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - clear local storage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 404:
          // Log 404 errors specifically
          console.error(`Endpoint not found: ${originalRequest?.url}`);
          break;
        case 500:
          console.error("Server error occurred");
          break;
      }
    }

    return Promise.reject(error);
  }
);

// Safe JSON parsing utility
const safeJSONParse = (data, fallback = null) => {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error("JSON parsing error:", error);
    return fallback;
  }
};

// API endpoint validation
const validateEndpoint = async (endpoint) => {
  try {
    const response = await api.head(endpoint);
    return response.status === 200;
  } catch (error) {
    console.error(`Endpoint validation failed for ${endpoint}:`, error);
    return false;
  }
};

export const getTasks = async (filters = {}) => {
  try {
    // Validate endpoint before making the request
    const endpointExists = await validateEndpoint("/tasks");
    if (!endpointExists) {
      throw new Error("Tasks endpoint is not available. Please check your API configuration.");
    }

    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.dueDate) queryParams.append("dueDate", filters.dueDate);

    const query = queryParams.toString();
    const response = await api.get(`/tasks${query ? `?${query}` : ""}`);
    
    // Validate and sanitize response data
    if (!response.data) {
      throw new Error("No data received from server");
    }

    const tasks = Array.isArray(response.data) ? response.data : 
                 Array.isArray(response.data.tasks) ? response.data.tasks :
                 [];

    return tasks;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error("Tasks endpoint not found. Please check your API configuration.");
        case 401:
          throw new Error("Please log in to view tasks.");
        case 403:
          throw new Error("You don't have permission to view tasks.");
        default:
          throw new Error(error.response.data?.message || "Failed to fetch tasks");
      }
    }
    throw new Error("Network error. Please check your connection.");
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
