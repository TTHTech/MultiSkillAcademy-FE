import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StudentScores from "./ViewListTestScores";
const TabListTest = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleSelectTest = (test) => {
    setSelectedTest(test);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
        <StudentScores test={selectedTest} navigate={navigate} />
      )}
    </div>
  );
};
export default TabListTest;
