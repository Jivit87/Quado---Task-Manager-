import React, { useState, useEffect } from 'react';
import { getTask, createTask, updateTask } from '../services/taskService';
import Modal from './Modal';

const TaskFormModal = ({ isOpen, onClose, taskId = null, onTaskSaved }) => {
  const isEditMode = !!taskId;

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
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchTask = async () => {
      if (isEditMode && isOpen) {
        try {
          setLoading(true);
          const task = await getTask(taskId);
          setFormData({
            title: task.title || '',
            description: task.description || '',
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            category: task.category || 'Other',
            status: task.status || 'Pending'
          });
          setError(null);
          setFormErrors({});
        } catch (err) {
          setError('Failed to fetch task details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      if (!isEditMode) {
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          category: 'Other',
          status: 'Pending'
        });
        setError(null);
        setFormErrors({});
        setLoading(false);
      } else {
        fetchTask();
      }
    }
  }, [taskId, isEditMode, isOpen]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date('2025-05-16T03:08:00+05:30'); 
      today.setHours(0, 0, 0, 0); 
      if (dueDate < today) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      let savedTask;
      if (isEditMode) {
        savedTask = await updateTask(taskId, formData);
      } else {
        savedTask = await createTask(formData);
      }
      onTaskSaved(savedTask);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task');
      console.error('Task save error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = '2025-05-16';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Task' : 'Create New Task'}
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00FF85] border-t-transparent"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <div className="bg-[#FF2965] bg-opacity-20 border border-[#FF2965] border-opacity-40 text-[#FF2965] px-4 py-3 rounded-lg text-xs sm:text-sm" style={{ fontFamily: "'system-ui', sans-serif" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#A3B1B2] mb-1" htmlFor="title" style={{ fontFamily: "'system-ui', sans-serif" }}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85] ${
                formErrors.title ? 'border-[#FF2965]' : ''
              }`}
              required
              aria-invalid={!!formErrors.title}
              aria-describedby={formErrors.title ? 'title-error' : undefined}
              style={{ fontFamily: "'system-ui', sans-serif" }}
            />
            {formErrors.title && (
              <p id="title-error" className="mt-1 text-xs sm:text-sm text-[#FF2965]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                {formErrors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#A3B1B2] mb-1" htmlFor="description" style={{ fontFamily: "'system-ui', sans-serif" }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            ></textarea>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#A3B1B2] mb-1" htmlFor="dueDate" style={{ fontFamily: "'system-ui', sans-serif" }}>
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={minDate}
              className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85] ${
                formErrors.dueDate ? 'border-[#FF2965]' : ''
              }`}
              aria-invalid={!!formErrors.dueDate}
              aria-describedby={formErrors.dueDate ? 'dueDate-error' : undefined}
              style={{ fontFamily: "'system-ui', sans-serif" }}
            />
            {formErrors.dueDate && (
              <p id="dueDate-error" className="mt-1 text-xs sm:text-sm text-[#FF2965]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                {formErrors.dueDate}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#A3B1B2] mb-1" htmlFor="category" style={{ fontFamily: "'system-ui', sans-serif" }}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Urgent">Urgent</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#A3B1B2] mb-1" htmlFor="status" style={{ fontFamily: "'system-ui', sans-serif" }}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-[#677475] rounded-lg text-sm sm:text-base text-[#A3B1B2] hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#677475] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-lg text-sm sm:text-base text-[#0A0A0A] bg-[#00FF85] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default TaskFormModal;