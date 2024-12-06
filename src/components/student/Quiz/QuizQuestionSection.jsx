import React, { useState } from "react";

const QuizQuestionSection = ({ question, options, currentQuestionIndex, totalQuestions }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h2 className="text-4xl font-semibold mb-8">
        Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
      </h2>
      <p className="text-xl mb-8 text-center">{question}</p>

      <div className="space-y-6 w-full max-w-lg">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-full p-5 text-2xl border rounded-md ${selectedAnswer === option ? "bg-blue-600 text-white" : "bg-gray-300"}`}
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
