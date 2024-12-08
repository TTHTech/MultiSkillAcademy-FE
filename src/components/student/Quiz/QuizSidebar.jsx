import React from "react";

const QuizSidebar = ({ questions, currentQuestionIndex, onSelectQuestion, onFinish }) => {
  return (
    <div className="w-1/4 min-w-[250px] bg-gray-100 p-6 shadow-md rounded-lg flex flex-col space-y-6">
      <h3 className="font-semibold text-2xl text-gray-800">Danh sách câu hỏi</h3>
      
      <div className="grid grid-cols-6 gap-4">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`w-full py-4 text-lg text-center rounded-md transition-all duration-300 ease-in-out ${
              currentQuestionIndex === index
                ? "bg-purple-600 text-white transform scale-105"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => onSelectQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Finish Button */}
      <button
        className="w-full py-3 text-2xl font-semibold text-white bg-green-600 rounded-lg mt-auto hover:bg-green-700 transition-colors duration-200"
        onClick={onFinish}
      >
        Hoàn thành
      </button>
    </div>
  );
};

export default QuizSidebar;
