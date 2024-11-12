// src/components/home/HeroSection.jsx
import React from "react";

const HeroSection = () => {
  return (
    <section className="flex items-center justify-center bg-gray-100 py-16 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        {/* Phần nội dung chữ */}
        <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Học những gì bạn có hứng thú
            </h2>{" "}
            {/* Đặt màu đậm hơn */}
            <p className="text-gray-800 text-lg">
              Các kỹ năng cho hiện tại (và tương lai của bạn). Hãy bắt đầu học
              với chúng tôi.
            </p>
          </div>
        </div>

        {/* Phần hình ảnh */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://th.bing.com/th/id/R.1121b45735937ba6fbb48cc12c70c6f8?rik=QY0Pav2DonD0CA&pid=ImgRaw&r=0"
            alt="Illustration of person"
            className="max-w-xs md:max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
