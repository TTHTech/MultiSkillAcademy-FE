import React from "react";

const TabListTest = () => {
  const tests = [
    {
      id: 1,
      title: "Test 1 hour",
      duration: 15,
      questionCount: 3,
    },
    {
      id: 2,
      title: "Test 2 hours",
      duration: 30,
      questionCount: 5,
    },
    {
      id: 3,
      title: "Test 30 minutes",
      duration: 30,
      questionCount: 4,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách bài kiểm tra</h2>
      <ul className="space-y-4">
        {tests.map((test) => (
          <li
            key={test.id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            {/* Tiêu đề nổi bật */}
            <h3 className="text-2xl font-extrabold text-blue-600 mb-2">
              {test.title}
            </h3>
            {/* Thời gian nổi bật */}
            <p className="text-lg font-semibold text-green-500">
              Thời gian: {test.duration} phút
            </p>
            {/* Số câu hỏi */}
            <p className="text-gray-600">Số câu hỏi: {test.questionCount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabListTest;
