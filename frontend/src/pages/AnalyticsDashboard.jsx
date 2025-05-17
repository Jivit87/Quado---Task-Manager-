import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, isBefore, addDays } from "date-fns";
import { api } from "../services/taskService";
import Navbar from "../components/Navbar";
import 'remixicon/fonts/remixicon.css';

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/tasks/analytics");
        setDashboardData(response.data.success ? response.data.data : null);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data."
        );
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleExportData = async () => {
    try {
      setExportLoading(true);
      const response = await api.get("/tasks/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `task-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportLoading(false);
    } catch (err) {
      setExportLoading(false);
      alert("Failed to export data.");
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "#F59E0B",
      "in progress": "#8B5CF6",
      completed: "#10B981",
    };
    return statusColors[status.toLowerCase()] || "#6B7280";
  };

  const NoDataPlaceholder = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-[#2A2A2A] rounded-xl border border-[#2A2A2A]">
      <div className="bg-[#1A1A1A] p-4 rounded-full border border-[#677475] mb-4">
        <svg
          className="w-10 h-10 text-[#677475]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p
        className="text-[#A3B1B2] text-lg font-semibold"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {message}
      </p>
      <p
        className="text-[#677475] text-sm mt-2"
        style={{ fontFamily: "'system-ui', sans-serif" }}
      >
        Add tasks to visualize your progress
      </p>
      <button
        className="mt-4 px-4 py-2 bg-[#00FF85] text-[#0A0A0A] rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Add New Task
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00FF85] border-t-transparent"></div>
          <p
            className="mt-4 text-[#A3B1B2] font-semibold text-base"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FF2965] bg-opacity-20 rounded-xl p-6 mx-auto my-10 max-w-3xl border border-[#FF2965] border-opacity-40">
        <div className="flex items-center">
          <svg
            className="h-8 w-8 text-[#FF2965]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="ml-4">
            <h3
              className="text-lg font-semibold text-[#FF2965]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Error
            </h3>
            <p
              className="mt-2 text-[#FF2965] text-sm"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#FF2965] bg-opacity-30 hover:bg-opacity-50 text-[#FF2965] px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-4">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-2xl font-bold text-white mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Analytics Dashboard
          </h1>
          <NoDataPlaceholder message="No task data available" />
        </div>
      </div>
    );
  }

  const { summary, tasksByDate, statusBreakdown, upcomingDeadlines } =
    dashboardData;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 pt-20">
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] pt-6 pb-4 px-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Analytics Dashboard
                </h1>
                <p
                  className="text-[#A3B1B2] mt-2 text-sm"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  Visualize your productivity
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={exportLoading}
                className="mt-4 md:mt-0 bg-[#00FF85] text-[#0A0A0A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <div className="flex items-center justify-center">
                  {exportLoading ? (
                    <i className="ri-loader-4-fill animate-spin -ml-1 mr-2 h-4 w-4 text-[#0A0A0A]"></i>
                  ) : (
                    <i className="ri-download-fill w-4 h-4 mr-2"></i>
                  )}
                  <span>Export Analytics</span>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Tasks",
                value: summary.totalTasks || 0,
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                color: "#00FF85",
              },
              {
                label: "Completed",
                value: summary.completedTasks || 0,
                icon: "M5 13l4 4L19 7",
                color: "#10B981",
              },
              {
                label: "Pending",
                value: summary.pendingTasks || 0,
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                color: "#F59E0B",
              },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full bg-[${color}] bg-opacity-20 mr-4`}
                  >
                    <svg
                      className={`h-5 w-5 text-[${color}]`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-[#A3B1B2] text-xs font-medium"
                      style={{ fontFamily: "'system-ui', sans-serif" }}
                    >
                      {label}
                    </p>
                    <h3
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {value}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 hover:shadow-lg">
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Task Activity
              </h2>
              {tasksByDate?.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={tasksByDate}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#677475" />
                    <XAxis
                      dataKey="date"
                      tick={{
                        fill: "#A3B1B2",
                        fontSize: 12,
                        fontFamily: "'system-ui', sans-serif",
                      }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fill: "#A3B1B2",
                        fontSize: 12,
                        fontFamily: "'system-ui', sans-serif",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A1A1A",
                        borderRadius: "8px",
                        border: "1px solid #2A2A2A",
                        padding: "10px",
                        color: "#FFFFFF",
                        fontFamily: "'system-ui', sans-serif",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontSize: "14px",
                        color: "#A3B1B2",
                        fontFamily: "'system-ui', sans-serif",
                      }}
                    />
                    <Bar
                      dataKey="completed"
                      name="Completed"
                      fill="#10B981"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="added"
                      name="New Tasks"
                      fill="#8B5CF6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <NoDataPlaceholder message="No timeline data available" />
              )}
            </div>

            <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 hover:shadow-lg">
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Task Status
              </h2>
              {statusBreakdown?.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={6}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getStatusColor(entry.status)}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A1A1A",
                        borderRadius: "8px",
                        border: "1px solid #2A2A2A",
                        padding: "10px",
                        color: "#FFFFFF",
                        fontFamily: "'system-ui', sans-serif",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "30px",
                        fontSize: "14px",
                        color: "#A3B1B2",
                        fontFamily: "'system-ui', sans-serif",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <NoDataPlaceholder message="No status data available" />
              )}
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] mb-6">
            <div className="p-6">
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Upcoming Deadlines
              </h2>
            </div>
            {upcomingDeadlines?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2A2A2A]">
                  <thead className="bg-[#2A2A2A]">
                    <tr>
                      {[
                        "Task",
                        "Category",
                        "Due Date",
                        "Status",
                        "Due In",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-semibold text-[#A3B1B2] uppercase"
                          style={{ fontFamily: "'system-ui', sans-serif" }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]">
                    {upcomingDeadlines.map((task, index) => {
                      const dueDate = new Date(task.dueDate);
                      const TODAY = new Date("2025-05-16T16:05:00+05:30");
                      const isOverdue = isBefore(dueDate, TODAY);
                      const isDueToday =
                        format(dueDate, "yyyy-MM-dd") ===
                        format(TODAY, "yyyy-MM-dd");
                      const statusColor = isOverdue
                        ? "text-[#FF2965]"
                        : isDueToday
                        ? "text-[#F59E0B]"
                        : "text-white";
                      const dueIn = isOverdue
                        ? "Overdue"
                        : isDueToday
                        ? "Today"
                        : `${Math.ceil(
                            (dueDate.getTime() - TODAY.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} day${
                            Math.ceil(
                              (dueDate.getTime() - TODAY.getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) !== 1
                              ? "s"
                              : ""
                          }`;

                      return (
                        <tr
                          key={task._id}
                          className={`hover:bg-[#2A2A2A] ${
                            index % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#252525]"
                          }`}
                        >
                          <td
                            className="px-4 py-4 text-sm text-white"
                            style={{ fontFamily: "'system-ui', sans-serif" }}
                          >
                            {task.title}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="px-2 py-1 text-xs font-semibold rounded-full bg-[#8B5CF6] bg-opacity-20 text-[#8B5CF6]"
                              style={{ fontFamily: "'system-ui', sans-serif" }}
                            >
                              {task.category}
                            </span>
                          </td>
                          <td
                            className="px-4 py-4 text-sm"
                            style={{ fontFamily: "'system-ui', sans-serif" }}
                          >
                            <div className={statusColor}>
                              {format(dueDate, "MMM dd, yyyy")}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="px-2 py-1 text-xs font-semibold rounded-full"
                              style={{
                                backgroundColor: `${getStatusColor(
                                  task.status
                                )}20`,
                                color: getStatusColor(task.status),
                                fontFamily: "'system-ui', sans-serif",
                              }}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td
                            className="px-4 py-4 text-sm font-medium"
                            style={{ fontFamily: "'system-ui', sans-serif" }}
                          >
                            <div
                              className={
                                isOverdue
                                  ? "text-[#FF2965]"
                                  : isDueToday
                                  ? "text-[#F59E0B]"
                                  : "text-[#10B981]"
                              }
                            >
                              {dueIn}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            <button
                              className="text-[#AF52DE] hover:brightness-110 mr-3"
                              style={{ fontFamily: "'system-ui', sans-serif" }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-[#AF52DE] hover:brightness-110"
                              style={{ fontFamily: "'system-ui', sans-serif" }}
                            >
                              {task.status.toLowerCase() === "completed"
                                ? "View"
                                : "Complete"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 pt-0">
                <NoDataPlaceholder message="No upcoming deadlines" />
              </div>
            )}
            {upcomingDeadlines?.length > 0 && (
              <div className="p-6 bg-[#252525] border-t border-[#2A2A2A]">
                <h3
                  className="text-base font-semibold text-white mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Upcoming Calendar
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-semibold text-[#A3B1B2] py-2"
                        style={{ fontFamily: "'system-ui', sans-serif" }}
                      >
                        {day}
                      </div>
                    )
                  )}
                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = addDays(
                      new Date("2025-05-16T16:05:00+05:30"),
                      index
                    );
                    const hasDeadline = upcomingDeadlines.some(
                      (task) =>
                        format(new Date(task.dueDate), "yyyy-MM-dd") ===
                        format(date, "yyyy-MM-dd")
                    );
                    return (
                      <div
                        key={index}
                        className={`p-3 text-center rounded-lg ${
                          hasDeadline
                            ? "bg-[#8B5CF6] bg-opacity-20"
                            : "bg-[#2A2A2A]"
                        } ${
                          index === 0 ? "ring-2 ring-[#8B5CF6]" : ""
                        } hover:shadow-md cursor-pointer`}
                      >
                        <div
                          className="text-xs text-[#677475]"
                          style={{ fontFamily: "'system-ui', sans-serif" }}
                        >
                          {format(date, "EEE")}
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            hasDeadline ? "text-[#8B5CF6]" : "text-white"
                          }`}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {format(date, "d")}
                        </div>
                        {hasDeadline && (
                          <div className="mt-2 w-2 h-2 bg-[#8B5CF6] rounded-full mx-auto"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6">
            <h2
              className="text-lg font-semibold text-white mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Productivity Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#2A2A2A] hover:shadow-md">
                <h3
                  className="text-[#A3B1B2] font-semibold mb-2 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Average Daily Completion
                </h3>
                <p
                  className="text-3xl font-bold text-[#8B5CF6]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {tasksByDate?.length > 0
                    ? (
                        tasksByDate.reduce(
                          (sum, day) => sum + day.completed,
                          0
                        ) / tasksByDate.length
                      ).toFixed(1)
                    : "0"}
                </p>
                <p
                  className="text-[#677475] text-xs mt-2"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  tasks per day
                </p>
              </div>
              <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#2A2A2A] hover:shadow-md">
                <h3
                  className="text-[#A3B1B2] font-semibold mb-2 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Most Productive Day
                </h3>
                {tasksByDate?.length > 0 ? (
                  <>
                    <p
                      className="text-3xl font-bold text-[#10B981]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {
                        tasksByDate.reduce(
                          (max, day) =>
                            day.completed > max.completed ? day : max,
                          tasksByDate[0]
                        ).date
                      }
                    </p>
                    <p
                      className="text-[#677475] text-xs mt-2"
                      style={{ fontFamily: "'system-ui', sans-serif" }}
                    >
                      {
                        tasksByDate.reduce(
                          (max, day) =>
                            day.completed > max.completed ? day : max,
                          tasksByDate[0]
                        ).completed
                      }{" "}
                      tasks completed
                    </p>
                  </>
                ) : (
                  <p
                    className="text-[#677475] text-sm"
                    style={{ fontFamily: "'system-ui', sans-serif" }}
                  >
                    No data available
                  </p>
                )}
              </div>
              <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#2A2A2A] hover:shadow-md">
                <h3
                  className="text-[#A3B1B2] font-semibold mb-2 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Overdue Tasks
                </h3>
                <p
                  className="text-3xl font-bold text-[#FF2965]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {summary.overdueTasks || 0}
                </p>
                <p
                  className="text-[#677475] text-xs mt-2"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  tasks overdue
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
