import React from "react";

const TabTest = () => {
  const tests = [
    {
      id: 1,
      title: "Test 1 hour",
      duration: 15,
      questionCount: 3,
    },
    // Nếu có nhiều bài kiểm tra, bạn có thể tiếp tục thêm vào đây
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
            <h3 className="text-xl font-semibold text-gray-800">{test.title}</h3>
            <p className="text-gray-600">Thời gian: {test.duration} phút</p>
            <p className="text-gray-600">Số câu hỏi: {test.questionCount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabTest;
