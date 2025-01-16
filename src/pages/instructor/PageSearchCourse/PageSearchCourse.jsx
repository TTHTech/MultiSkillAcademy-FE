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
        return course[key]?.toString().toLowerCase().includes(criteria[key].toLowerCase());
      });
    });
    setFilteredCourses(filtered);
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section
      className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-gray-100 shadow-lg rounded-lg min-h-screen ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} />
      <div className="m-3 text-xl text-gray-900 font-semibold">
        <FilterCourse onFilter={handleFilter} />
        <TableCourse courses={filteredCourses} />
      </div>
    </section>
  );
};

export default PageSearchCourse;
