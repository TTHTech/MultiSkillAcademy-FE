// SuccessPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessForm = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/student/home'); // Chuyển hướng về trang /student/home
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
        <p className="text-lg text-gray-700 mb-6">Cảm ơn bạn đã thực hiện giao dịch với chúng tôi. Chúc bạn có những trải nghiệm tuyệt vời!</p>
        
        <button
          onClick={handleHomeClick}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-green-600 hover:scale-105"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default SuccessForm;
