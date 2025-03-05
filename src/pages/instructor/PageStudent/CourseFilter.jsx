import { useState, useEffect } from "react";

const CourseFilter = ({ students, onFilterChange }) => {
  const [filters, setFilters] = useState({
    course: "",
    name: "",
    email: "",
    phone: "",
    progress: "",
  });

  const courseOptions = Array.from(new Set(students.map((s) => s.courseName)));

  useEffect(() => {
    let filtered = students.filter((student) => {
      return (
        (!filters.course || student.courseName === filters.course) &&
        (!filters.name || (`${student.firstName} ${student.lastName}`).toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.email || student.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.phone || student.phoneNumber?.includes(filters.phone)) &&
        (!filters.progress ||
          (filters.progress === "1-40" && student.progress >= 1 && student.progress <= 40) ||
          (filters.progress === "40-70" && student.progress > 40 && student.progress <= 70) ||
          (filters.progress === "70-100" && student.progress > 70 && student.progress <= 100))
      );
    });

    onFilterChange(filtered);
  }, [filters, students]);

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <select className="py-2 px-3 border rounded-md" onChange={(e) => setFilters({ ...filters, course: e.target.value })}>
        <option value="">All Courses</option>
        {courseOptions.map((course) => (
          <option key={course} value={course}>{course}</option>
        ))}
      </select>

      <input type="text" placeholder="Search by name" className="py-2 px-3 border rounded-md" onChange={(e) => setFilters({ ...filters, name: e.target.value })} />

      <input type="text" placeholder="Search by email" className="py-2 px-3 border rounded-md" onChange={(e) => setFilters({ ...filters, email: e.target.value })} />

      <input type="text" placeholder="Search by phone" className="py-2 px-3 border rounded-md" onChange={(e) => setFilters({ ...filters, phone: e.target.value })} />

      <select className="py-2 px-3 border rounded-md" onChange={(e) => setFilters({ ...filters, progress: e.target.value })}>
        <option value="">All Progress</option>
        <option value="1-40">1% - 40%</option>
        <option value="40-70">41% - 70%</option>
        <option value="70-100">71% - 100%</option>
      </select>
    </div>
  );
};

export default CourseFilter;
