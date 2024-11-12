// src/components/student/CoursesDetail/CourseMedia.jsx
import React from 'react';

const CourseMedia = ({ price, thumbnail, onAddToCart, onBuyNow }) => {
  return (
    <div className="bg-white p-6 rounded shadow-lg text-center max-w-xs w-full lg:sticky lg:top-24 lg:mr-4">
      {/* Thumbnail */}
      <img src={thumbnail} alt="Preview" className="w-full mb-4 rounded-lg" />
      <p className="text-sm font-medium text-gray-500 mb-2">Xem trước khóa học này</p>
      
      {/* Price */}
      <div className="text-3xl font-bold text-gray-800 mb-4">đ {price}</div>

      {/* Add to Cart Button */}
      <button 
        onClick={onAddToCart} 
        className="bg-purple-600 text-white w-full py-2 rounded-lg font-semibold text-lg mb-2 hover:bg-purple-700"
      >
        Thêm vào giỏ hàng
      </button>

      {/* Buy Now Button */}
      {/* Buy Now Button */}
      <button 
      onClick={onBuyNow} 
      className="border w-full py-2 rounded-lg font-semibold text-lg mb-4 text-gray-800 hover:bg-gray-100"
      >
      Mua ngay
      </button>

      {/* Refund Policy */}
      <p className="text-sm text-gray-400 mb-4">Đảm bảo hoàn tiền trong 30 ngày</p>

      {/* Course Details */}
      <div className="text-left text-gray-700">
        <p className="font-semibold mb-2">Khóa học này bao gồm:</p>
        <ul className="space-y-1 mb-4 text-sm">
          <li>✅ 18 giờ video theo yêu cầu</li>
          <li>✅ Bài tập</li>
          <li>✅ 51 tài nguyên có thể tải xuống</li>
          <li>✅ Truy cập trên thiết bị di động và TV</li>
          <li>✅ Quyền truy cập đầy đủ suốt đời</li>
          <li>✅ Giấy chứng nhận hoàn thành</li>
        </ul>
      </div>

      {/* Additional Links */}
      <div className="flex justify-between text-sm text-blue-600">
        <a href="#share" className="hover:underline">Chia sẻ</a>
        <a href="#gift" className="hover:underline">Tặng khóa học này</a>
      </div>
    </div>
  );
};

export default CourseMedia;
