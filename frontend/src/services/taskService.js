import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://quado-task-manager-backend.onrender.com'  
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.config.url.includes('/tasks/dashboard')) {
      console.log('Dashboard data fetched successfully');
    } else {
      console.log(`API call to ${response.config.url} successful`);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken && !error.config.url.includes('/auth/refresh')) {
        return api.post('/auth/refresh', { refreshToken })
          .then(res => {
            localStorage.setItem('token', res.data.token);
            if (res.data.refreshToken) {
              localStorage.setItem('refreshToken', res.data.refreshToken);
            }
            
            error.config.headers['Authorization'] = `Bearer ${res.data.token}`;
            return api(error.config);
          })
          .catch(refreshError => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          
            return Promise.reject(error);
          });
      }
    
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
    }
    
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const getTasks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.dueDate) queryParams.append('dueDate', filters.dueDate);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    
    const query = queryParams.toString();
    const response = await api.get(`/tasks${query ? `?${query}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getTask = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getDashboardData = async () => {
  try {
    const response = await api.get('/tasks/dashboard');
    const { data } = response.data;
    
    const sanitizedData = {
      summary: {
        totalTasks: data.summary.totalTasks,
        completedTasks: data.summary.completedTasks,
        pendingTasks: data.summary.pendingTasks,
        overdueTasks: data.summary.overdueTasks,
        dueToday: data.summary.dueToday
      },
      tasksByDate: data.tasksByDate.map(item => ({
        date: item.date,
        completed: item.completed,
        added: item.added
      })),
      statusBreakdown: data.statusBreakdown,
      categoryBreakdown: data.categoryBreakdown,
      upcomingDeadlines: data.upcomingDeadlines.map(task => ({
        id: task._id,
        title: task.title,
        dueDate: task.dueDate,
        category: task.category,
        status: task.status
      })),
      aiInsights: data.aiInsights || []
    };

    return sanitizedData;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard data';
    throw new Error(errorMessage);
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update profile');
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/user/password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to change password');
  }
};

export const getUserStats = async () => {
  try {
    const response = await api.get('/user/stats');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch user statistics');
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
  updateUserProfile,
  changePassword,
  getUserStats
};