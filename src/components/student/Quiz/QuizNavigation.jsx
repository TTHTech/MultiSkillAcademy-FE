import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const QuizNavigation = ({ onNext, onPrev, isLastQuestion, isFirstQuestion }) => {
  return (
    <div className="w-full flex justify-between mt-6">
      {/* Nút quay về câu trước */}
      <button
        onClick={onPrev}
        className={`py-2 px-6 flex items-center text-white bg-blue-600 rounded-md ${isFirstQuestion ? "bg-gray-400 cursor-not-allowed" : ""}`}
        disabled={isFirstQuestion}
      >
        <FaArrowLeft className="mr-2" />
        Câu trước
      </button>

      {/* Nút đi tới câu tiếp theo */}
      <button
        onClick={onNext}
        className={`py-2 px-6 flex items-center text-white bg-blue-600 rounded-md ${isLastQuestion ? "bg-gray-400 cursor-not-allowed" : ""}`}
        disabled={isLastQuestion}
      >
        {isLastQuestion ? "Hoàn thành" : (
          <>
            Câu tiếp theo
            <FaArrowRight className="ml-2" />
          </>
        )}
      </button>
    </div>
  );
};

export default QuizNavigation;
