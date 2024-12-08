import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useParams } from "react-router-dom";

const CourseMedia = ({
  price,
  thumbnail,
  onAddToCart,
  onBuyNow,
  resourceDescription,
}) => {
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const userId = Number(localStorage.getItem("userId")); // Lấy userId từ localStorage
  const { courseId } = useParams(); // Course ID từ URL
  const [error, setError] = useState(null); // Quản lý lỗi khi thêm vào wishlist

  // Hàm thay đổi trạng thái yêu thích và gửi yêu cầu đến API
  const handleFavoriteToggle = async () => {
    setIsFavorite(!isFavorite); // Đảo trạng thái yêu thích
    
    // Gửi request đến API để thêm vào wishlist
    const requestData = {
      userId: userId,
      courseId: courseId,
      createdAt: new Date(), // Thời gian tạo wishlist
    };

    try {
      const response = await fetch('http://localhost:8080/api/student/add-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        console.log('Thêm vào wishlist thành công');
        // Có thể hiển thị thông báo thành công ở đây
      } else {
        throw new Error('Đã xảy ra lỗi khi thêm vào wishlist');
      }
    } catch (err) {
      setError(err.message); // Cập nhật lỗi nếu có
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg text-center max-w-xs w-full lg:sticky lg:top-24 lg:mr-4 z-10 border-2 border-red-500">
      {/* Thumbnail */}
      <img src={thumbnail} alt="Preview" className="w-full mb-4 rounded-lg" />
      
      {/* Price */}
      <div className="text-3xl font-bold text-gray-800 mb-4">đ {price}</div>

      {/* Add to Cart Button and Heart Icon */}
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

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CourseMedia;
