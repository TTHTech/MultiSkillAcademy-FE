import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import CourseFilter from "../../../components/student/category/CourseFilter";
import CourseCard from "../../../components/student/search/CourseCard";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { encodeId } from "../../../utils/hash";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const HotCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  useEffect(() => {
    const fetchHotCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(`${baseUrl}/api/student/courses/hot`);

        let fetchedCourses = [];
        if (Array.isArray(data)) {
          fetchedCourses = data;
        } else if (data.courses) {
          fetchedCourses = data.courses;
        } else {
          fetchedCourses =
            Object.values(data).find(
              (v) => Array.isArray(v) && v.length && v[0].courseId
            ) || [];
        }

        fetchedCourses.sort(
          (a, b) => (b.studentsCount || 0) - (a.studentsCount || 0)
        );

        setCourses(fetchedCourses);

        if (fetchedCourses.length === 0) {
          setError("Không tìm thấy khóa học nào.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Lỗi khi tải khóa học: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHotCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (filter.level && course.level !== filter.level) return false;

    if (filter.priceRange && !isInPriceRange(course.price, filter.priceRange))
      return false;

    if (filter.rating && course.rating < parseFloat(filter.rating))
      return false;

    return true;
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleEnroll = (courseId) => {
    console.log("Enrolling in course:", courseId);
  };

  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto mt-[90px]">
      <NavBar />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Danh sách các khóa học hot</h1>

        <div className="flex space-x-6">
          <div className="w-1/4">
            <CourseFilter onFilter={handleFilter} />
          </div>

          <div className="w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="ml-2 text-gray-600">Đang tải khóa học...</p>
              </div>
            ) : error ? (
              <div className="text-center text-gray-500 py-16">
                <p>{error}</p>
                <Link to="/student/home">
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Quay về trang chủ
                  </button>
                </Link>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center text-gray-500 py-16">
                <p>Không tìm thấy khóa học nào phù hợp với bộ lọc của bạn.</p>
                <button
                  onClick={() => setFilter({})}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md mr-3"
                >
                  Xóa bộ lọc
                </button>
                <Link to="/student/home">
                  <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md">
                    Quay về trang chủ
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Tìm thấy {filteredCourses.length} khóa học cho chủ đề này
                </p>

                <div className="grid grid-cols-1 gap-6">
                  {currentCourses.map((course, index) => (
                    <div key={index} className="w-full">
                      <Link to={`/course/${encodeId(course.courseId)}`}>
                        <CourseCard
                          course={course}
                          onEnroll={() => handleEnroll(course.courseId)}
                        />
                      </Link>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
                        currentPage === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
const isInPriceRange = (price, priceRange) => {
  if (!priceRange) return true;
  let priceValue = 0;
  if (typeof price === "string") {
    priceValue = parseInt(price.replace(/[^\d]/g, ""));
  } else if (typeof price === "number") {
    priceValue = price;
  }

  const [min, max] = priceRange.split("-").map((val) => parseInt(val));
  return priceValue >= min && priceValue <= max;
};

export default HotCoursesPage;
