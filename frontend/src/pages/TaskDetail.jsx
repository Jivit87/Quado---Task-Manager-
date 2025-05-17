import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTask, deleteTask } from "../services/taskService";
import TaskFormModal from "../components/TaskFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getTask(id);
        setTask(taskData);
      } catch (err) {
        setError("Failed to fetch task details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(task._id);
      navigate("/"); // Navigate back to dashboard after deletion
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const statusColors = {
    Pending: "bg-yellow-500 bg-opacity-20 text-yellow-400",
    "In-Progres": "bg-blue-500 bg-opacity-20 text-blue-400",
    Completed: "bg-green-500 bg-opacity-20 text-green-400",
  };

  const categoryColors = {
    Personal: "bg-purple-500 bg-opacity-20 text-purple-400",
    Work: "bg-gray-500 bg-opacity-20 text-gray-400",
    Urgent: "bg-red-500 bg-opacity-20 text-red-400",
    Other: "bg-teal-500 bg-opacity-20 text-teal-400",
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00FF85] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FF2965] bg-opacity-20 text-[#FF2965] p-4 rounded-lg my-4 border border-[#FF2965] border-opacity-40">
        {error}
        <div className="mt-4">
          <Link
            to="/"
            className="text-[#AF52DE] hover:text-[#AF52DE] hover:brightness-110 transition-colors text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-yellow-500 bg-opacity-20 text-yellow-400 p-4 rounded-lg my-4">
        Task not found
        <div className="mt-4">
          <Link
            to="/"
            className="text-[#AF52DE] hover:text-[#AF52DE] hover:brightness-110 transition-colors text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-lg shadow border border-[#2A2A2A]">
          <div className="flex justify-between items-start">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {task.title}
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-[#00FF85] text-[#0A0A0A] px-3 py-1 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#FF2965] text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#FF2965] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 my-4">
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                statusColors[task.status] || "bg-emerald-100 bg-opacity-10 text-emerald-600"
              }`}
            >
              {task.status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                categoryColors[task.category]
              }`}
            >
              {task.category}
            </span>
          </div>

          {task.dueDate && (
            <div className="my-4">
              <span className="font-semibold text-[#A3B1B2] text-sm sm:text-base">
                Due Date:
              </span>{" "}
              <span className="text-[#A3B1B2] text-sm sm:text-base">
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {task.description && (
            <div className="mt-6">
              <h2 className="text-base sm:text-lg font-semibold mb-2 text-white">
                Description
              </h2>
              <p className="text-[#A3B1B2] whitespace-pre-wrap text-sm sm:text-base">
                {task.description}
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
            <div className="text-xs sm:text-sm text-[#677475]">
              <div>Created: {new Date(task.createdAt).toLocaleString()}</div>
              <div>
                Last Updated: {new Date(task.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="text-[#AF52DE] hover:text-[#AF52DE] hover:brightness-110 transition-colors text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        taskId={id}
        onTaskSaved={setTask}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={task.title}
      />
    </div>
  );
};

export default TaskDetail;
