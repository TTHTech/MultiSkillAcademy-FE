import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StudentScores from "./ViewListTestScores";

const TabListTest = () => {
  const [tests, setTests] = useState([]); // Danh sách bài kiểm tra
  const [selectedTest, setSelectedTest] = useState(null); // Bài kiểm tra được chọn
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Thông báo lỗi
  const { id } = useParams(); // Lấy ID khóa học từ URL
  const navigate = useNavigate(); // Hook để điều hướng

  // Fetch danh sách bài kiểm tra khi component được mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/course/tests/${id}`
        );
        setTests(response.data);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu từ API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [id]);

  // Xử lý chọn bài kiểm tra
  const handleSelectTest = (test) => {
    setSelectedTest(test);
  };

  // Xử lý quay lại danh sách bài kiểm tra
  const handleBackToList = () => {
    setSelectedTest(null);
  };

  if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 font-semibold">
        {error}
      </p>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto mb-[50px]">
      {/* Danh sách bài kiểm tra */}
      {!selectedTest ? (
        <ul className="space-y-6">
          {tests.map((test) => (
            <li
              key={test.id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleSelectTest(test)}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h3 className="text-2xl font-semibold text-blue-600 mb-2 md:mb-0">
                  {test.title}
                </h3>
                <div className="mt-2 md:mt-0 flex space-x-6 items-center">
                  <p className="text-lg text-green-600 font-medium">
                    Thời gian:{" "}
                    <span className="text-gray-800">{test.duration} phút</span>
                  </p>
                  <p className="text-lg text-gray-700">
                    Số câu hỏi:{" "}
                    <span className="font-semibold text-gray-900">
                      {test.questionCount}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // Xem chi tiết bài kiểm tra đã chọn
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-blue-600">
              {selectedTest.title}
            </h2>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
            >
              Quay lại
            </button>
          </div>
          {/* Gọi component xem chi tiết điểm số */}
          <StudentScores test={selectedTest} navigate={navigate} />
        </div>
      )}
    </div>
  );
};

export default TabListTest;
