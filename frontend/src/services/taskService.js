import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
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
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: originalRequest?.url,
    });

    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 404:
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

// Task API functions
export const getTasks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.dueDate) queryParams.append("dueDate", filters.dueDate);

    const query = queryParams.toString();
    const response = await api.get(`/tasks${query ? `?${query}` : ""}`);
    return Array.isArray(response.data) ? response.data : response.data.tasks || [];
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch tasks";
    throw new Error(message);
  }
};

export const getTask = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch task");
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create task");
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update task");
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};

export const getDashboardData = async () => {
  try {
    const response = await api.get("/tasks/dashboard");
    const { data } = response.data;

    return {
      summary: data.summary,
      tasksByDate: data.tasksByDate,
      statusBreakdown: data.statusBreakdown,
      categoryBreakdown: data.categoryBreakdown,
      upcomingDeadlines: data.upcomingDeadlines,
      aiInsights: data.aiInsights,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch dashboard data";
    throw new Error(message);
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
