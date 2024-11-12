import React from 'react';

const SidebarFilter = ({ filters, setFilters }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-72 h-full border border-gray-200">
            <h2 className="font-extrabold text-xl mb-6 text-gray-800">Filter Courses</h2>

            {/* Search by course name */}
            <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">Search by Name:</label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    placeholder="Enter course name"
                />
            </div>

            {/* Filter by completion range */}
            <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">Completion Level:</label>
                <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={filters.completionRange}
                    onChange={(e) => setFilters({ ...filters, completionRange: e.target.value })}
                >
                    <option value="">Select range</option>
                    <option value="under25">Under 25%</option>
                    <option value="25to50">25% - 50%</option>
                    <option value="50to80">50% - 80%</option>
                    <option value="80to100">80% - 100%</option>
                </select>
            </div>

            {/* Filter by purchase date */}
            <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">Purchase Date:</label>
                <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={filters.purchaseDate}
                    onChange={(e) => setFilters({ ...filters, purchaseDate: e.target.value })}
                />
            </div>

            {/* Reset Filters Button */}
            <button
                className="w-full mt-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                onClick={() => setFilters({ searchTerm: '', completionRange: '', purchaseDate: '' })}
            >
                Reset Filters
            </button>
        </div>
    );
};

export default SidebarFilter;
