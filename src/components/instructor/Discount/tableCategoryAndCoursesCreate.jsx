import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const TableCategoryAndCourses = ({
  applicableCategories,
  setApplicableCategories,
  applicableCourses,
  setApplicableCourses,
}) => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const userId = Number(localStorage.getItem("userId"));
  const filteredCourses = courses.filter((course) => {
    const lowerSearch = courseSearchTerm.toLowerCase();
    return (
      course.courseId.toLowerCase().includes(lowerSearch) ||
      course.title.toLowerCase().includes(lowerSearch)
    );
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get(
        `${baseUrl}/api/instructor/discounts/categories/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching categories: " + error.message);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get(`${baseUrl}/api/instructor/discounts/courses/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching courses: " + error.message);
        setLoading(false);
      });
  }, [userId]);
  const handleCategoryChange = (category) => {
    const exists = applicableCategories.find(
      (c) => c.categoryId === category.categoryId
    );
    if (exists) {
      setApplicableCategories(
        applicableCategories.filter((c) => c.categoryId !== category.categoryId)
      );
      if (category.courses && category.courses.length > 0) {
        setApplicableCourses(
          applicableCourses.filter(
            (course) =>
              !category.courses.some(
                (catCourse) => catCourse.courseId === course.courseId
              )
          )
        );
      }
    } else {
      setApplicableCategories([
        ...applicableCategories,
        { categoryId: category.categoryId, name: category.name, courses: null },
      ]);
      if (category.courses && category.courses.length > 0) {
        setApplicableCourses([
          ...applicableCourses,
          ...category.courses.filter(
            (course) =>
              !applicableCourses.some((c) => c.courseId === course.courseId)
          ),
        ]);
      }
    }
  };

  const handleCourseChange = (course) => {
    const exists = applicableCourses.find(
      (c) => c.courseId === course.courseId
    );
    if (exists) {
      const newApplicableCourses = applicableCourses.filter(
        (c) => c.courseId !== course.courseId
      );
      setApplicableCourses(newApplicableCourses);
      categories.forEach((category) => {
        if (
          category.courses &&
          category.courses.some(
            (catCourse) => catCourse.courseId === course.courseId
          )
        ) {
          if (
            applicableCategories.find(
              (c) => c.categoryId === category.categoryId
            )
          ) {
            setApplicableCategories(
              applicableCategories.filter(
                (c) => c.categoryId !== category.categoryId
              )
            );
          }
        }
      });
    } else {
      const newApplicableCourses = [
        ...applicableCourses,
        { courseId: course.courseId, title: course.title },
      ];
      setApplicableCourses(newApplicableCourses);
      categories.forEach((category) => {
        if (
          category.courses &&
          category.courses.some(
            (catCourse) => catCourse.courseId === course.courseId
          )
        ) {
          const allCoursesSelected = category.courses.every((catCourse) =>
            newApplicableCourses.some(
              (selected) => selected.courseId === catCourse.courseId
            )
          );
          if (
            allCoursesSelected &&
            !applicableCategories.find(
              (c) => c.categoryId === category.categoryId
            )
          ) {
            setApplicableCategories([
              ...applicableCategories,
              { categoryId: category.categoryId, name: category.name },
            ]);
          }
        }
      });
    }
  };

  return (
    <div className="p-6 bg-white">
      {loading && <p className="text-gray-800 text-sm mb-2">Loading...</p>}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <div className="mb-6">
        <h3 className="text-lg text-gray-800 mb-2">Categories</h3>
        <div className="max-h-[200px] overflow-y-auto">
          <table className="w-full text-gray-800 border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1">Chọn</th>
                <th className="border border-gray-300 px-2 py-1">
                  Category ID
                </th>
                <th className="border border-gray-300 px-2 py-1">Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={
                        !!applicableCategories.find(
                          (c) => c.categoryId === category.categoryId
                        )
                      }
                      onChange={() => handleCategoryChange(category)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {category.categoryId}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {category.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg text-gray-800">Courses</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID or Title..."
              value={courseSearchTerm}
              onChange={(e) => setCourseSearchTerm(e.target.value)}
              className="pl-2 pr-8 py-1 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
            />
            {courseSearchTerm && (
              <button
                onClick={() => setCourseSearchTerm("")}
                className="absolute right-1 top-1 text-gray-500 hover:text-gray-700 text-xs"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-gray-800 border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1">Chọn</th>
                <th className="border border-gray-300 px-2 py-1">Course ID</th>
                <th className="border border-gray-300 px-2 py-1">Title</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.courseId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={
                        !!applicableCourses.find(
                          (c) => c.courseId === course.courseId
                        )
                      }
                      onChange={() => handleCourseChange(course)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {course.courseId}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {course.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableCategoryAndCourses;
