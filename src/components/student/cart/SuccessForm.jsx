// SuccessPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SuccessForm = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/student/home'); // Chuyển hướng về trang /student/home
  };

  useEffect(() => {
    // Hàm bắn pháo hoa xung quanh form
    const launchFireworks = () => {
      const duration = 5 * 1000; // 5 giây
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 10,
          angle: 90,
          spread: 100,
          origin: { x: 0.5, y: 0.3 },
        });
        confetti({
          particleCount: 10,
          angle: 120,
          spread: 120,
          origin: { x: 0.2, y: 0.5 },
        });
        confetti({
          particleCount: 10,
          angle: 60,
          spread: 120,
          origin: { x: 0.8, y: 0.5 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    };

    launchFireworks();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mt-[100px]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center relative overflow-hidden border-4 border-dashed border-green-400">
        <h1 className="text-4xl font-extrabold text-green-700 mb-6 animate-pulse">Thanh toán thành công!</h1>
        <p className="text-lg text-gray-700 mb-8">Cảm ơn bạn đã thực hiện giao dịch với chúng tôi. Chúc bạn có những trải nghiệm tuyệt vời!</p>

        <button
          onClick={handleHomeClick}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:from-green-600 hover:to-blue-600 hover:scale-110"
        >
          Quay lại trang chủ
        </button>

        {/* Hiệu ứng pháo bông nền */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-ping bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 w-96 h-96 rounded-full absolute -top-20 -left-20 blur-3xl opacity-60"></div>
          <div className="animate-ping bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 w-80 h-80 rounded-full absolute -bottom-20 -right-20 blur-3xl opacity-60"></div>
          <div className="animate-spin-slow bg-gradient-to-r from-blue-400 to-green-500 w-64 h-64 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-xl opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default SuccessForm;
