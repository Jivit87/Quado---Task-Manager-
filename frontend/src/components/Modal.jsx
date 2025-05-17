import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    
    // Handle escape key press
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">

      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      />
      

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative rounded-lg bg-[#1A1A1A] text-left shadow-xl w-full sm:max-w-lg border border-[#2A2A2A]">
          <div className="px-4 pb-4 pt-4 border-b border-[#2A2A2A] flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              type="button"
              className="text-[#A3B1B2] hover:text-white"
              onClick={onClose}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="px-4 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;