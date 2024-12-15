import React, { useEffect, useState } from "react";
import axios from "axios";

const ScoreTable = () => {
    const [scores, setScores] = useState([]);
    const [filteredScores, setFilteredScores] = useState([]);
    const [courses, setCourses] = useState([]);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
  
    const [filters, setFilters] = useState({
        studentName: "",
        courseName: "",
        minScore: "",
        maxScore: "",
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        // Fetch danh sách khóa học và điểm số liên quan
        const fetchCoursesAndScores = async () => {
            try {
                // Lấy danh sách các khóa học của giảng viên
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

                // Lấy danh sách courseId từ các khóa học
                const courseIds = fetchedCourses.map((course) => course.courseId);

                // Lấy điểm cho từng courseId
                const testPromises = courseIds.map((courseId) =>
                    fetch(`http://localhost:8080/api/student/scores/details/course/${courseId}`)
                        .then((response) => response.json())
                );

                // Tổng hợp tất cả dữ liệu điểm từ các khóa học
                const scoresData = await Promise.all(testPromises);
                const aggregatedScores = scoresData.flat(); // Gộp các mảng con lại thành 1 mảng lớn
                setScores(aggregatedScores);
                setFilteredScores(aggregatedScores); // Khởi tạo danh sách điểm đã lọc
            } catch (error) {
                console.error("Error fetching courses or scores:", error);
            }
        };

        fetchCoursesAndScores();
    }, [userId, token]);
    // Hàm lọc dữ liệu
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        // Ràng buộc giá trị minScore và maxScore từ 1 đến 10
        if ((name === "minScore" || name === "maxScore") && value !== "") {
            const numericValue = Math.max(1, Math.min(10, parseFloat(value))); // Đảm bảo giá trị trong khoảng 1-10
            setFilters({ ...filters, [name]: numericValue });
        } else {
            setFilters({ ...filters, [name]: value });
        }
    };

    // Lọc dữ liệu
    useEffect(() => {
        const filtered = scores.filter((score) => {
            const fullName = `${score.firstName} ${score.lastName}`.toLowerCase();
            const matchesName =
                !filters.studentName ||
                fullName.includes(filters.studentName.toLowerCase());
            const matchesCourse =
                !filters.courseName ||
                score.nameCourse
                    .toLowerCase()
                    .includes(filters.courseName.toLowerCase());
            const matchesScore =
                (!filters.minScore || score.score >= parseFloat(filters.minScore)) &&
                (!filters.maxScore || score.score <= parseFloat(filters.maxScore));

            return matchesName && matchesCourse && matchesScore;
        });

        setFilteredScores(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [filters, scores]);

    // Tính toán các mục hiển thị trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredScores.slice(indexOfFirstItem, indexOfLastItem);

    // Tổng số trang
    const totalPages = Math.ceil(filteredScores.length / itemsPerPage);

    // Chuyển đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-5xl mx-auto bg-gray-100 rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Student Scores
                </h1>

                {/* Bộ lọc */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Student Name
                        </label>
                        <input
                            type="text"
                            name="studentName"
                            value={filters.studentName}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Enter student name"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Course Name
                        </label>
                        <input
                            type="text"
                            name="courseName"
                            value={filters.courseName}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Enter course name"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Min Score (1-10)
                        </label>
                        <input
                            type="number"
                            name="minScore"
                            value={filters.minScore}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Min score"
                            min="1"
                            max="10"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Max Score (1-10)
                        </label>
                        <input
                            type="number"
                            name="maxScore"
                            value={filters.maxScore}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Max score"
                            min="1"
                            max="10"
                        />
                    </div>
                </div>

                {/* Bảng hiển thị */}
                <table className="w-full border-collapse border border-gray-300 text-left">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                                Student Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                                Course Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                                Test Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                                Score
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-sm font-medium">
                                Test Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((score) => (
                            <tr key={score.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                    {score.firstName} {score.lastName}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                    {score.nameCourse}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                    {score.nameTest}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                    {score.score}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                    {new Date(score.testDate).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded ${
                                currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScoreTable;
