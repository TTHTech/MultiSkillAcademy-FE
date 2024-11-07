import { useEffect, useState } from "react";
import axios from "axios";
import CoursesList from "../../../components/instructor/Card/StudentCourseList";
import SidebarFilter from "../../../components/instructor/Sidebar/SidebarFilterCourse";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    completionRange: "",
    purchaseDate: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/student/24"
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = courses;

      // Lọc theo tên khóa học
      if (filters.searchTerm) {
        filtered = filtered.filter((course) =>
          course.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }

      // Lọc theo mức độ hoàn thành
      if (filters.completionRange) {
        switch (filters.completionRange) {
          case "under25":
            filtered = filtered.filter((course) => course.progress < 25);
            break;
          case "25to50":
            filtered = filtered.filter(
              (course) => course.progress >= 25 && course.progress <= 50
            );
            break;
          case "50to80":
            filtered = filtered.filter(
              (course) => course.progress > 50 && course.progress <= 80
            );
            break;
          case "80to100":
            filtered = filtered.filter(
              (course) => course.progress > 80 && course.progress <= 100
            );
            break;
          default:
            break;
        }
      }

      // Lọc theo ngày mua
      if (filters.purchaseDate) {
        filtered = filtered.filter((course) => {
          const enrolledAt = new Date(course.enrolled_at);
          const selectedDate = new Date(filters.purchaseDate);
          return enrolledAt.toDateString() === selectedDate.toDateString();
        });
      }

      setFilteredCourses(filtered);
    };

    applyFilters();
  }, [filters, courses]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/4 p-6 bg-white shadow-md border-r border-gray-200 sticky top-0 h-screen">
        <SidebarFilter filters={filters} setFilters={setFilters} />
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Available Courses
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CoursesList filteredCourses={filteredCourses} />
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
