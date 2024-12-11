import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate  } from "react-router-dom";

const TabListTest = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); 
  const navigate = useNavigate();
  useEffect(() => {
    // Hàm gọi API
    const fetchTests = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/student/course/tests/${id}`);
        setTests(response.data); // Giả sử API trả về mảng các bài test
      } catch (err) {
        setError("Lỗi khi tải dữ liệu từ API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [id]);
  const handleNavigate = (testId) => {
    navigate(`/student/quiz/${testId}`);
  };
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ul className="space-y-6">
        {tests.map((test) => (
          <li
            key={test.id}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl"
            onClick={() => handleNavigate(test.id)}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              {/* Test Title */}
              <h3 className="text-2xl font-semibold text-blue-600 mb-2 md:mb-0">{test.title}</h3>

              {/* Duration and Question Count */}
              <div className="mt-2 md:mt-0 flex space-x-6 items-center">
                <p className="text-lg text-green-600 font-medium">
                  Thời gian: <span className="text-gray-800">{test.duration} phút</span>
                </p>
                <p className="text-lg text-gray-700">
                  Số câu hỏi: <span className="font-semibold text-gray-900">{test.questionCount}</span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabListTest;
