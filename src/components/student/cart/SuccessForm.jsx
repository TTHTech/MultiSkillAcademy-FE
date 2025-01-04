import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SuccessForm = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/student/home');
  };

  useEffect(() => {
    // Hiệu ứng pháo hoa chính
    const launchMainFireworks = () => {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
      };

      const firework = () => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) return;
        
        // Tạo nhiều hiệu ứng pháo hoa với màu sắc và vị trí khác nhau
        confetti({
          particleCount: 15,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.4) },
          colors: ['#00ff00', '#0099ff', '#ff0066', '#ffaa00', '#00ffff'],
          startVelocity: 30,
          gravity: 0.5,
          drift: 0,
          ticks: 200,
          shapes: ['circle', 'square'],
          zIndex: 100,
          scalar: 0.75,
          disableForReducedMotion: true
        });

        requestAnimationFrame(firework);
      };

      firework();
    };

    // Hiệu ứng pháo hoa bổ sung
    const launchSecondaryFireworks = () => {
      const end = Date.now() + 2000;

      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: colors
        });

        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    };

    // Kích hoạt cả hai hiệu ứng
    launchMainFireworks();
    launchSecondaryFireworks();

    // Timer để kích hoạt lại hiệu ứng sau mỗi 6 giây
    const fireworksInterval = setInterval(() => {
      launchSecondaryFireworks();
    }, 6000);

    return () => clearInterval(fireworksInterval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-3xl animate-pulse"></div>
        </div>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xl mx-4">
        <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
              <svg 
                className="w-12 h-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-white animate-fade-in">
              Thanh toán thành công!
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Cảm ơn bạn đã thực hiện giao dịch. 
              <br />
              Chúc bạn có những trải nghiệm học tập tuyệt vời!
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleHomeClick}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {/* Button Background Animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              
              {/* Button Text */}
              <span className="relative flex items-center gap-2">
                <span>Quay lại trang chủ</span>
                <svg 
                  className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Mã giao dịch của bạn đã được ghi nhận
              <br />
              Vui lòng kiểm tra email để xem chi tiết
            </p>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

// Custom styles to add to your global CSS
const styles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-fade-in {
  animation: fadeIn 1.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default SuccessForm;