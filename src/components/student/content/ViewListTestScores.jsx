import React, { useState, useEffect } from "react";

const StudentScores = ({ test, navigate }) => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Tính điểm cao nhất
  const getMaxScore = () => {
    if (scores.length === 0) return 0;
    return Math.max(...scores.map((score) => score.score));
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/student/scores/details/tests/${test.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        return response.json();
      })
      .then((data) => {
        setScores(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [test.id]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = scores.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(scores.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  if (isLoading) {
    return <div className="text-center text-blue-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        {test.title} - Student Test Scores
      </h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => navigate(`/student/quiz/${test.id}`)}
      >
        Làm bài kiểm tra
      </button>

      {/* Hiển thị điểm cao nhất */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Điểm cao nhất từng đạt được: {getMaxScore().toFixed(2)}</h2>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Test Date</th>
            <th className="border border-gray-300 px-4 py-2">Test Name</th>
            <th className="border border-gray-300 px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((score) => (
            <tr key={score.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">
                {new Date(score.testDate).toLocaleDateString("en-US")}
              </td>
              <td className="border border-gray-300 px-4 py-2">{score.nameTest}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {score.score.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2 disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
        <span className="px-4">
          Trang {currentPage} / {Math.ceil(scores.length / itemsPerPage)}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 ml-2 disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(scores.length / itemsPerPage)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default StudentScores;
