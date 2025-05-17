import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/ai`;

const getToken = () => {
  return localStorage.getItem("token");
};

const configureAxios = () => {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
};

const getSuggestedPriority = async (taskId) => {
  try {
    const response = await axios.get(
      `${API_URL}/priority/${taskId}`,
      configureAxios()
    );
    return response.data;
  } catch (error) {
    console.error("Error getting priority suggestion:", error);
    throw error;
  }
};

const getDailyPlan = async () => {
  try {
    const response = await axios.get(`${API_URL}/daily-plan`, configureAxios());
    return response.data;
  } catch (error) {
    console.error("Error getting daily plan:", error);
    throw error;
  }
};

const getTaskInsights = async () => {
  try {
    const response = await axios.get(`${API_URL}/insights`, configureAxios());
    return response.data;
  } catch (error) {
    console.error("Error getting task insights:", error);
    throw error;
  }
};

const getMotivationalQuote = async () => {
  try {
    const response = await axios.get(`${API_URL}/quote`, configureAxios());
    return response.data;
  } catch (error) {
    console.error("Error getting motivational quote:", error);
    throw error;
  }
};

const getWeeklyFocusSuggestion = async () => {
  try {
    const response = await axios.get(`${API_URL}/weekly-focus`, configureAxios()); // ✅ Fixed API path
    return response.data;
  } catch (error) {
    console.error("Error getting weekly focus suggestion:", error);
    throw error;
  }
};

const aiService = {
  getSuggestedPriority,
  getDailyPlan,
  getTaskInsights,
  getMotivationalQuote,
  getWeeklyFocusSuggestion
};

export default aiService;