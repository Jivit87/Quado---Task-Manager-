import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteTask } from '../services/taskService';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import toast from 'react-hot-toast';

const TaskItem = ({ task, onDelete, onUpdate, onEditClick }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const statusColors = {
    'Pending': 'bg-yellow-500 bg-opacity-20 text-yellow-400',
    'In Progress': 'bg-blue-500 bg-opacity-20 text-blue-400',
    'Completed': 'bg-green-500 bg-opacity-20 text-green-400'
  };

  const categoryColors = {
    'Personal': 'bg-purple-500 bg-opacity-20 text-purple-400',
    'Work': 'bg-gray-500 bg-opacity-20 text-gray-400',
    'Urgent': 'bg-red-500 bg-opacity-20 text-red-400',
    'Other': 'bg-teal-500 bg-opacity-20 text-teal-400'
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(task._id);
      onDelete(task._id);
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEditClick(task._id);
  };

  return (
    <>
      <div className="bg-[#1A1A1A] p-4 rounded-lg shadow-sm border border-[#2A2A2A] hover:shadow-md transition-shadow">
      <Link to={`/task/${task._id}`} className="flex-grow">
        <div className="flex justify-between items-start">
          
            <h3 className="text-base sm:text-lg font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
              {task.title}
            </h3>
        
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="text-[#00FF85] hover:text-[#00FF85] hover:brightness-110 transition-colors"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="text-[#FF2965] hover:text-[#FF2965] hover:brightness-110 transition-colors"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[task.category]}`}>
            {task.category}
          </span>
        </div>
        
        {task.dueDate && (
          <div className="mt-2 text-xs text-[#A3B1B2]">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
          </Link>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={task.title}
      />
    </>
  );
};

export default TaskItem;