import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import TableCourse from "../../../components/instructor/SearchCourse/TableCourse";
import FilterCourse from "../../../components/instructor/SearchCourse/FilterCourse";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const PageSearchCourse = () => {
  const [open, setOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/instructor/course-table/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [userId, token]);

  const handleFilter = (criteria) => {
    const filtered = courses.filter((course) =>
      Object.keys(criteria).every((key) => {
        if (!criteria[key]) return true;
        if (key === "price") {
          return course[key] <= criteria[key];
        }
        return course[key]
          ?.toString()
          .toLowerCase()
          .includes(criteria[key].toLowerCase());
      })
    );
    setFilteredCourses(filtered);
  };

  return (
    <section
      className={`m-4 p-5 bg-white rounded-lg shadow-xl transition-all duration-300 ${
        open ? "ml-72" : "ml-16"
      } min-h-screen`}
    >
      <div className="flex justify-between items-center mb-5">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex-1 ml-5">
          <h2 className="text-3xl font-bold text-gray-800">Search Courses</h2>
        </div>
      </div>
      <div className="relative bg-gray-50 p-4 rounded-lg shadow-sm">
        {error && (
          <p className="text-red-500 font-semibold mb-4">{error}</p>
        )}
        <FilterCourse onFilter={handleFilter} />
        <div className="overflow-hidden bg-white rounded-lg shadow-md mt-5">
          <TableCourse courses={filteredCourses} />
        </div>
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
            <p className="mt-4 text-blue-500 text-xl font-bold">
              Loading...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageSearchCourse;
