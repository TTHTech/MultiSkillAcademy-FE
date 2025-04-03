import { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("http://localhost:8080/api/admin/discounts/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching categories: " + error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("http://localhost:8080/api/admin/discounts/courses", {
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
  }, []);
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
    <div>
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="mb-6">
        <h3 className="text-xl text-white mb-2">Categories</h3>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <table className="w-full text-white border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1">Chọn</th>
                <th className="border px-2 py-1">Category ID</th>
                <th className="border px-2 py-1">Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.categoryId}>
                  <td className="border px-2 py-1 text-center">
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
                  <td className="border px-2 py-1">{category.categoryId}</td>
                  <td className="border px-2 py-1">{category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-xl text-white mb-2">Courses</h3>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="w-full text-white border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1">Chọn</th>
                <th className="border px-2 py-1">Course ID</th>
                <th className="border px-2 py-1">Title</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseId}>
                  <td className="border px-2 py-1 text-center">
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
                  <td className="border px-2 py-1">{course.courseId}</td>
                  <td className="border px-2 py-1">{course.title}</td>
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