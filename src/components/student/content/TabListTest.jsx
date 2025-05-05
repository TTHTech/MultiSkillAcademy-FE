import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Clock, FileText, ChevronLeft } from "lucide-react";
import StudentScores from "./ViewListTestScores";
import { decodeId } from '../../../utils/hash';

const TabListTest = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseHash } = useParams();
  const id = decodeId(courseHash);
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

  const handleBackToList = () => {
    setSelectedTest(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-600 font-medium">
          Đang tải dữ liệu...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto mt-8">
        <p className="text-center text-red-600 font-medium flex items-center justify-center">
          <span className="mr-2">⚠️</span>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto mb-12">
      {!selectedTest ? (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Danh sách bài kiểm tra
          </h1>
          <div className="grid gap-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 
                         hover:shadow-lg hover:border-blue-100 transition-all duration-300 
                         cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleSelectTest(test)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                      {test.title}
                    </h3>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2 text-green-500" />
                        <span className="font-medium">
                          {test.duration} phút
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="font-medium">
                          {test.questionCount} câu hỏi
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:self-center">
                    <button className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg 
                                   hover:bg-blue-100 transition-colors duration-200 
                                   font-medium text-sm">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedTest.title}
            </h2>
            <button
              onClick={handleBackToList}
              className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 
                       rounded-lg hover:bg-gray-200 transition-colors duration-200 
                       font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Quay lại
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <StudentScores test={selectedTest} navigate={navigate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TabListTest;