import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function FilterReport({ onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [reporterRole, setReporterRole] = useState("ALL");

  const handleSearchChange = e => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter({ searchTerm: value, reporterRole });
  };

  const handleRoleChange = e => {
    const value = e.target.value;
    setReporterRole(value);
    onFilter({ searchTerm, reporterRole: value });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Tìm kiếm báo cáo..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-4 py-2 w-full bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <select
          value={reporterRole}
          onChange={handleRoleChange}
          className="pl-10 pr-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="INSTRUCTOR">Giảng viên</option>
          <option value="STUDENT">Học viên</option>
        </select>
      </div>
    </div>
  );
}
