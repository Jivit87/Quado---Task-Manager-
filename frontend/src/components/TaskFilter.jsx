import React from 'react';

const TaskFilter = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      category: '',
      status: '',
      dueDate: ''
    });
  };

  return (
    <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-medium mb-4 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        Filter Tasks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#A3B1B2] mb-1" style={{ fontFamily: "'system-ui', sans-serif" }}>
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            <option value="">All Categories</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Urgent">Urgent</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#A3B1B2] mb-1" style={{ fontFamily: "'system-ui', sans-serif" }}>
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#A3B1B2] mb-1" style={{ fontFamily: "'system-ui', sans-serif" }}>
            Due Date
          </label>
          
          <input
            type="date"
            name="dueDate"
            value={filters.dueDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-[#2A2A2A] text-white border-[#677475] focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85]"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          />
        </div>
      </div>

      {(filters.category || filters.status || filters.dueDate) && (
        <div className="mt-4 text-right">
          <button
            onClick={handleClearFilters}
            className="text-[#AF52DE] hover:text-[#AF52DE] hover:brightness-110 transition-colors text-xs sm:text-sm"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilter;