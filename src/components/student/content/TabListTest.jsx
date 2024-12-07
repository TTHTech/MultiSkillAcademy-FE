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
    <div className="p-6 max-w-4xl mx-auto">
      <ul className="space-y-6">
        {tests.map((test) => (
          <li
            key={test.id}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl"
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
