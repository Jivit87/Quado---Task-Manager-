import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, createTask, updateTask } from '../services/taskService';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'Other',
    status: 'Pending'
  });

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (isEditMode) {
        try {
          const task = await getTask(id);
          setFormData({
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            category: task.category,
            status: task.status
          });
          setError(null);
        } catch (err) {
          setError('Failed to fetch task details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTask();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateTask(id, formData);
      } else {
        await createTask(formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save task');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00FF85] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] min-h-screen">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-lg shadow border border-[#2A2A2A]">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h1>

          {error && (
            <div className="bg-[#FF2965] bg-opacity-20 text-[#FF2965] p-3 rounded-lg mb-4 border border-[#FF2965] border-opacity-40">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="title">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="dueDate">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-[#677475] text-[#A3B1B2] rounded-lg text-sm sm:text-base hover:bg-[#2A2A2A] transition-all focus:outline-none focus:ring-2 focus:ring-[#677475] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#00FF85] text-[#0A0A0A] rounded-lg text-sm sm:text-base font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] disabled:bg-opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {submitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;