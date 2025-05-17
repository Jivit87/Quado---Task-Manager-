import React, { useState, useEffect } from 'react';
import TaskItem from '../components/TaskItem';
import TaskFilter from '../components/TaskFilter';
import TaskFormModal from '../components/TaskFormModal';
import { getTasks } from '../services/taskService';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dueDate: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await getTasks(filters);
      
      if (Array.isArray(tasksData)) {
        // Sort tasks by createdAt date, newest first
        const sortedTasks = [...tasksData].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTasks(sortedTasks);
      } else {
        throw new Error('Received data is not in the expected format');
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    if (
      newFilters.category !== filters.category ||
      newFilters.status !== filters.status ||
      newFilters.dueDate !== filters.dueDate
    ) {
      setFilters(newFilters);
    }
  };

  const handleTaskDelete = (deletedTaskId) => {
    setTasks(tasks.filter(task => task._id !== deletedTaskId));
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
  };

  const openCreateModal = () => {
    setCurrentTaskId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (taskId) => {
    setCurrentTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTaskId(null);
  };

  const handleTaskSaved = (task) => {
    if (currentTaskId) {
      handleTaskUpdate(task);
    } else {
      setTasks([...tasks, task]);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br pt-20 from-[#0A0A0A] to-[#1A1A1A] min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your Tasks
            </h1>
            <button
              onClick={openCreateModal}
              className="bg-[#00FF85] text-[#0A0A0A] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Add New Task
            </button>
          </div>

          <TaskFilter filters={filters} onFilterChange={handleFilterChange} />

          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00FF85] border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-[#FF2965] bg-opacity-20 text-[#FF2965] p-4 rounded-lg my-4 border border-[#FF2965] border-opacity-40">
              {error}
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-yellow-500 bg-opacity-20 text-yellow-400 p-4 rounded-lg my-4">
              No tasks found. Try adjusting filters or add a new task.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 sm:mt-6">
              {tasks.map((task) => (
                <div key={task._id}>
                  <TaskItem
                    task={task}
                    onDelete={handleTaskDelete}
                    onUpdate={handleTaskUpdate}
                    onEditClick={() => openEditModal(task._id)}
                  />
                </div>
              ))}
            </div>
          )}

          <TaskFormModal
            isOpen={isModalOpen}
            onClose={closeModal}
            taskId={currentTaskId}
            onTaskSaved={handleTaskSaved}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;