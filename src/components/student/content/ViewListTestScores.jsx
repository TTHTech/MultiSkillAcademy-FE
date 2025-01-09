import React, { useState, useEffect } from "react";
import { Loader2, ChevronLeft, ChevronRight, Trophy, PenTool } from "lucide-react";

const StudentScores = ({ test, navigate }) => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const getMaxScore = () => {
    if (scores.length === 0) return 0;
    return Math.max(...scores.map((score) => score.score));
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/student/scores/details/tests/${test.id}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu điểm số");
        }
        const data = await response.json();
        setScores(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, [test.id]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = scores.slice(startIndex, endIndex);
  const totalPages = Math.ceil(scores.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600 font-medium">
          Đang tải dữ liệu...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-center text-red-600 font-medium">
          Lỗi: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Kết quả kiểm tra: {test.title}
        </h1>
        <button
          onClick={() => navigate(`/student/quiz/${test.id}`)}
          className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          <PenTool className="w-5 h-5 mr-2" />
          Làm bài kiểm tra
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Điểm cao nhất đạt được
          </h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {getMaxScore().toFixed(2)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Ngày kiểm tra
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Tên bài kiểm tra
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                Điểm số
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((score, index) => (
              <tr
                key={score.id}
                className={`
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  hover:bg-blue-50 transition-colors duration-150
                `}
              >
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(score.testDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  {score.nameTest}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-blue-600">
                    {score.score.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 bg-white border border-gray-300
                     text-gray-700 rounded-lg hover:bg-gray-50 transition-colors
                     duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Trang trước
          </button>
          <div className="px-4 py-2 text-sm text-gray-600 font-medium">
            Trang {currentPage} / {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 bg-white border border-gray-300
                     text-gray-700 rounded-lg hover:bg-gray-50 transition-colors
                     duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang sau
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentScores;