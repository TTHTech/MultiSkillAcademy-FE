import React from "react";

const QuizSidebar = ({ questions, currentQuestionIndex, onSelectQuestion }) => {
  return (
    <div className="w-1/4 min-w-[250px] bg-gray-100 p-4 shadow-md"> {/* Đảm bảo chiều rộng cố định */}
      <h3 className="font-semibold mb-4 text-xl">Danh sách câu hỏi</h3>
      <div className="space-y-2 grid grid-cols-6 gap-4">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`w-full py-4 px-6 text-2xl text-center rounded-md ${currentQuestionIndex === index ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => onSelectQuestion(index)}
          >
          {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizSidebar;
