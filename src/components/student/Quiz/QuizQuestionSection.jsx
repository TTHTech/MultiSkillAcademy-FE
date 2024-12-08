import React, { useState } from "react";

const QuizQuestionSection = ({ question, options, currentQuestionIndex, totalQuestions }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white shadow-xl rounded-lg max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-semibold text-gray-800">
        Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
      </h2>
      <p className="text-xl text-gray-600 text-center">{question}</p>

      <div className="space-y-4 w-full max-w-lg">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-full p-4 text-xl font-medium rounded-lg border transition-all duration-300 ease-in-out ${
              selectedAnswer === option
                ? "bg-blue-600 text-white border-blue-600 transform scale-105"
                : "bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300 hover:border-gray-500"
            }`}
            onClick={() => handleSelectAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestionSection;
