import React, { useState, useEffect } from "react";
import aiService from "../services/aiService";
import taskService from "../services/taskService";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const AIAssistant = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState({
    tasks: true,
    plan: false,
    quote: true,
  });
  const [dailyPlan, setDailyPlan] = useState("");
  const [motivationalQuote, setMotivationalQuote] = useState("");

  // Daily plan fetching
  const fetchDailyPlan = async () => {
    try {
      setLoading(prev => ({ ...prev, plan: true }));
      const planData = await aiService.getDailyPlan();
      setDailyPlan(planData.plan);
      setLoading(prev => ({ ...prev, plan: false }));
    } catch (error) {
      console.error("Error fetching daily plan:", error);
      toast.error(error.response?.data?.message || "Failed to generate daily plan");
      setLoading(prev => ({ ...prev, plan: false }));
    }
  };

  // Fetching quote from backend
  const fetchMotivationalQuote = async () => {
    try {
      setLoading(prev => ({ ...prev, quote: true }));
      const quoteData = await aiService.getMotivationalQuote();
      setMotivationalQuote(quoteData.quote);
      setLoading(prev => ({ ...prev, quote: false }));
    } catch (error) {
      console.error("Error fetching motivational quote:", error);
      toast.error("Failed to load motivational quote");
      setMotivationalQuote("Keep moving forward.");
      setLoading(prev => ({ ...prev, quote: false }));
    }
  };

  // Fetching tasks and quote on page load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const tasksData = await taskService.getTasks();
        setTasks(tasksData);
        setLoading(prev => ({ ...prev, tasks: false }));

        await fetchMotivationalQuote();
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load some data. Please refresh the page.");
      }
    };

    fetchInitialData();
  }, []);

  const updateTaskPriority = async (taskId, priority) => {
    try {
      await taskService.updateTask(taskId, { priority });
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
      toast.success("Task priority updated successfully");
    } catch (error) {
      console.error("Error updating task priority:", error);
      toast.error(error.response?.data?.message || "Failed to update task priority");
    }
  };

  // Filter tasks that need priority suggestions
  const getTasksNeedingPriority = () => {
    return tasks.filter(task => {
      if (task.status === "Completed") return false;
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      return diffDays <= 3 && task.priority !== "High";
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0A0A] py-8 sm:py-12">
        <div className="container pt-[70px] mx-auto px-4 sm:px-6 w-full">
          {/* Motivational Quote Here */}
          <div className="mb-8 sm:mb-12 bg-[#1A1A1A] rounded-xl p-6 sm:p-8 shadow-lg border border-[#2A2A2A] flex items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mr-[40px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              AI Assistant
            </h1>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#00FF85]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h3.414m-8.828 0A2 2 0 013 12V6a2 2 0 012-2h6"
                />
              </svg>
              {loading.quote ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-[#00FF85] mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-lg sm:text-xl italic text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                    Loading quote...
                  </p>
                </div>
              ) : (
                <p className="text-lg sm:text-xl italic text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                  {motivationalQuote}
                </p>
              )}
            </div>
          </div>

          {/* Daily Plan Generator Here */}
          <div className="mb-8 sm:mb-12 bg-[#1A1A1A] rounded-xl p-6 sm:p-8 shadow-lg border border-[#2A2A2A]">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Daily Plan Generator
            </h2>
            <button
              onClick={fetchDailyPlan}
              disabled={loading.plan}
              className="w-full bg-[#00FF85] text-[#0A0A0A] py-3 px-6 rounded-lg text-base font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {loading.plan ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-[#0A0A0A] mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Plan...
                </div>
              ) : (
                "Generate Daily Plan"
              )}
            </button>
            
            {dailyPlan && (
              <div className="bg-[#2A2A2A] p-6 rounded-lg border border-[#2A2A2A]">
                <div className="flex items-start gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#00FF85] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Your Daily Plan
                    </h3>
                    <div
                      className="whitespace-pre-line text-[#A3B1B2] text-base"
                      style={{ fontFamily: "'system-ui', sans-serif" }}
                    >
                      {dailyPlan}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Smart Task Priority Assistant Here */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 sm:p-8 shadow-lg border border-[#2A2A2A]">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Smart Task Priority Assistant
            </h2>
            
            {loading.tasks ? (
              <div className="text-center py-6">
                <p className="text-[#A3B1B2] text-base" style={{ fontFamily: "'system-ui', sans-serif" }}>
                  Loading tasks...
                </p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[#A3B1B2] text-base" style={{ fontFamily: "'system-ui', sans-serif" }}>
                  No tasks available. Add some tasks to get priority suggestions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getTasksNeedingPriority().map(task => (
                  <div
                    key={task._id}
                    className="bg-[#2A2A2A] rounded-lg p-4 border border-[#2A2A2A] hover:border-[#00FF85] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <h3
                          className="font-medium text-white text-base mb-2"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {task.title}
                        </h3>
                        <div className="space-y-1">
                          <p
                            className="text-sm text-[#A3B1B2]"
                            style={{ fontFamily: "'system-ui', sans-serif" }}
                          >
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                          <p
                            className="text-sm text-[#A3B1B2]"
                            style={{ fontFamily: "'system-ui', sans-serif" }}
                          >
                            Current Priority:{" "}
                            <span
                              className={`font-semibold ${
                                task.priority === "High"
                                  ? "text-[#FF2965]"
                                  : task.priority === "Medium"
                                  ? "text-[#F59E0B]"
                                  : "text-[#00FF85]"
                              }`}
                            >
                              {task.priority || "Not Set"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateTaskPriority(task._id, "High")}
                        className="w-full sm:w-auto bg-[#00FF85] text-[#0A0A0A] py-2 px-4 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Mark as High Priority
                      </button>
                    </div>
                  </div>
                ))}
                
                {getTasksNeedingPriority().length === 0 && (
                  <div className="text-center py-6">
                    <p
                      className="text-[#A3B1B2] text-base"
                      style={{ fontFamily: "'system-ui', sans-serif" }}
                    >
                      No tasks currently need priority suggestions.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;