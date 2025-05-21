import { useState, useEffect } from "react";

const CourseFilter = ({ students, onFilterChange }) => {
  const [filters, setFilters] = useState({
    course: "",
    search: "",
    progress: "",
  });

  const courseOptions = Array.from(new Set(students.map((s) => s.courseName)));

  useEffect(() => {
    const filtered = students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = student.email.toLowerCase();
      const phone = student.phoneNumber || "";
      const searchTerm = filters.search.toLowerCase();

      const matchesSearch =
        filters.search.trim() === "" ||
        fullName.includes(searchTerm) ||
        email.includes(searchTerm) ||
        phone.includes(searchTerm);

      const matchesCourse =
        !filters.course || student.courseName === filters.course;

      const matchesProgress =
        !filters.progress ||
        (filters.progress === "1-40" &&
          student.progress >= 1 &&
          student.progress <= 40) ||
        (filters.progress === "40-70" &&
          student.progress > 40 &&
          student.progress <= 70) ||
        (filters.progress === "70-100" &&
          student.progress > 70 &&
          student.progress <= 100);

      return matchesSearch && matchesCourse && matchesProgress;
    });

    onFilterChange(filtered);
  }, [filters, students]);

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <select
        className="py-2 px-3 border rounded-md"
        onChange={(e) => setFilters({ ...filters, course: e.target.value })}
        value={filters.course}
      >
        <option value="">Tất cả khóa học</option>
        {courseOptions.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Tìm theo tên, email hoặc SĐT"
        className="py-2 px-3 border rounded-md flex-1 min-w-[200px]"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <select
        className="py-2 px-3 border rounded-md"
        onChange={(e) => setFilters({ ...filters, progress: e.target.value })}
        value={filters.progress}
      >
        <option value="">Tất cả tiến độ</option>
        <option value="1-40">1% - 40%</option>
        <option value="40-70">41% - 70%</option>
        <option value="70-100">71% - 100%</option>
      </select>
    </div>
  );
};

export default CourseFilter;
