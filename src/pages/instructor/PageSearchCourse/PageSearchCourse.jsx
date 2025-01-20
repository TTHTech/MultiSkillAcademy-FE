import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import TableCourse from "../../../components/instructor/SearchCourse/TableCourse";
import FilterCourse from "../../../components/instructor/SearchCourse/FilterCourse";
import axios from "axios";

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
          `http://localhost:8080/api/instructor/course-table/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
    const filtered = courses.filter((course) => {
      return Object.keys(criteria).every((key) => {
        if (!criteria[key]) return true;
        if (key === "price") {
          return course[key] <= criteria[key];
        }
        return course[key]
          ?.toString()
          .toLowerCase()
          .includes(criteria[key].toLowerCase());
      });
    });
    setFilteredCourses(filtered);
  };
  return (
    <section
      className={`m-4 p-5 bg-white rounded-lg shadow-xl transition-all duration-300 ${
        open ? "ml-72" : "ml-16"
      } min-h-screen`}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex justify-between items-center">
          <Sidebar open={open} setOpen={setOpen} />
          <div className="flex-1 ml-5">
            <h2 className="text-3xl font-bold text-gray-800">
              Search Courses
            </h2>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <FilterCourse onFilter={handleFilter} />
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-md mt-5">
          <TableCourse courses={filteredCourses} />
        </div>
      </div>
    </section>
  );
};

export default PageSearchCourse;
