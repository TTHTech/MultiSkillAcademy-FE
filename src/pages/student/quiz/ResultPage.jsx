import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const { score, totalQuestions } = location.state;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h2 className="text-4xl font-semibold mb-8">Kết quả thi</h2>
      <p className="text-xl mb-8 text-center">
        Bạn đã trả lời đúng {score}/{totalQuestions} câu hỏi.
      </p>
      <div className="space-y-4">
        <p className="text-lg">Cảm ơn bạn đã tham gia quiz!</p>
      </div>
    </div>
  );
};

export default ResultPage;
