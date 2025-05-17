import React from 'react';
import Modal from './Modal';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
    >
      <div className="space-y-4">
        <p className="text-white text-sm sm:text-base">
          Are you sure you want to delete the task 
          <span className="font-medium"> "{taskTitle}"</span>?
        </p>
        <p className="text-[#A3B1B2] text-xs sm:text-sm">
          This action cannot be undone.
        </p>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 border border-[#677475] rounded-lg text-sm sm:text-base text-[#A3B1B2] hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#677475] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-lg text-sm sm:text-base text-white bg-[#FF2965] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FF2965] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Delete Task
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;