import React, { useEffect, useState } from "react";
import axios from "axios";

const ScoreTable = () => {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [courses, setCourses] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState({
    search: "", // Ô tìm kiếm gộp cho cả tên sinh viên và khóa học
    minScore: "",
    maxScore: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCoursesAndScores = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/instructor/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedCourses = response.data;
        setCourses(fetchedCourses);
        const courseIds = fetchedCourses.map((course) => course.courseId);
        const testPromises = courseIds.map((courseId) =>
          fetch(
            `http://localhost:8080/api/student/scores/details/course/${courseId}`
          ).then((response) => response.json())
        );
        const scoresData = await Promise.all(testPromises);
        const aggregatedScores = scoresData.flat();
        setScores(aggregatedScores);
        setFilteredScores(aggregatedScores);
      } catch (error) {
        console.error("Error fetching courses or scores:", error);
      }
    };

    fetchCoursesAndScores();
  }, [userId, token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if ((name === "minScore" || name === "maxScore") && value !== "") {
      const numericValue = Math.max(1, Math.min(10, parseFloat(value)));
      setFilters({ ...filters, [name]: numericValue });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  useEffect(() => {
    const filtered = scores.filter((score) => {
      const fullName = `${score.firstName} ${score.lastName}`.toLowerCase();
      const courseName = score.nameCourse.toLowerCase();
      const searchTerm = filters.search.toLowerCase();
      
      // Tìm kiếm cả trong tên sinh viên và tên khóa học
      const matchesSearch = !searchTerm || 
        fullName.includes(searchTerm) || 
        courseName.includes(searchTerm);
      
      const matchesScore =
        (!filters.minScore || score.score >= parseFloat(filters.minScore)) &&
        (!filters.maxScore || score.score <= parseFloat(filters.maxScore));

      return matchesSearch && matchesScore;
    });

    setFilteredScores(filtered);
    setCurrentPage(1);
  }, [filters, scores]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredScores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredScores.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, 2, 3);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, 2, 3);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-6 px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bảng Điểm Sinh Viên</h1>
          <p className="text-blue-100 font-medium">
            Quản lý và lọc dữ liệu kết quả học tập của sinh viên
          </p>
        </div>
        
        <div className="p-8">
          {/* Khu vực lọc và tìm kiếm */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Tìm kiếm (Sinh viên hoặc Khóa học)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm theo tên sinh viên hoặc khóa học..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Điểm Thấp Nhất (1-10)
              </label>
              <input
                type="number"
                name="minScore"
                value={filters.minScore}
                onChange={handleFilterChange}
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Điểm thấp nhất"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Điểm Cao Nhất (1-10)
              </label>
              <input
                type="number"
                name="maxScore"
                value={filters.maxScore}
                onChange={handleFilterChange}
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Điểm cao nhất"
              />
            </div>
          </div>
          
          {/* Tóm tắt kết quả */}
          <div className="flex justify-between items-center mb-4">
            <div className="font-medium text-gray-600">
              Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredScores.length)} của {filteredScores.length} kết quả
            </div>
          </div>
          
          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
                    Tên Sinh Viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
                    Tên Khóa Học
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
                    Tên Bài Kiểm Tra
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
                    Điểm Số
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
                    Ngày Kiểm Tra
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((score) => (
                    <tr key={score.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                        {score.firstName} {score.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {score.nameCourse}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {score.nameTest}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center justify-center w-10 py-1 px-2 text-sm font-medium rounded-full
                          ${score.score >= 7 ? 'bg-green-100 text-green-800' : score.score >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {score.score}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {new Date(score.testDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy kết quả nào phù hợp với tiêu chí tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Phân trang */}
          {totalPages > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                    currentPage === 1
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                    currentPage === totalPages
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;