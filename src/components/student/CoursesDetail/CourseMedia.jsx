import React, { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'; // Import các icon trái tim đầy và rỗng

const CourseMedia = ({ 
  price, 
  thumbnail, 
  onAddToCart, 
  onBuyNow, 
  resourceDescription 
}) => {
  // Quản lý trạng thái yêu thích
  const [isFavorite, setIsFavorite] = useState(false); // Khởi tạo với giá trị mặc định là false (trái tim trắng)

  // Hàm thay đổi trạng thái yêu thích khi người dùng nhấn vào trái tim
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite); // Đảo trạng thái yêu thích
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg text-center max-w-xs w-full lg:sticky lg:top-24 lg:mr-4">
      {/* Thumbnail */}
      <img src={thumbnail} alt="Preview" className="w-full mb-4 rounded-lg" />
      <p className="text-sm font-medium text-gray-500 mb-2">Xem trước khóa học này</p>
      
      {/* Price */}
      <div className="text-3xl font-bold text-gray-800 mb-4">đ {price}</div>

      {/* Add to Cart Button and Heart Icon with equal width */}
      <div className="flex items-center justify-between mb-4">
        {/* Thêm vào giỏ hàng */}
        <button 
          onClick={onAddToCart} 
          className="bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold text-lg w-full mr-2 hover:bg-purple-700"
        >
          Thêm vào giỏ hàng
        </button>
        
        {/* Biểu tượng trái tim */}
        <div onClick={handleFavoriteToggle} className="cursor-pointer w-10 h-10 flex items-center justify-center border-2 border-gray-600 rounded-lg bg-white">
          {isFavorite ? (
            <AiFillHeart className="text-red-500 text-xl" />
          ) : (
            <AiOutlineHeart className="text-gray-600 text-xl" />
          )}
        </div>
      </div>

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
          {resourceDescription && resourceDescription.length > 0 ? (
            resourceDescription.map((item, index) => (
              <li key={index} className="text-gray-600">✅ {item}</li>
            ))
          ) : (
            <li className="text-gray-600">Không có tài nguyên nào.</li>
          )}
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
