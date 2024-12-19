import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const CourseMedia = ({
  price,
  thumbnail,
  onAddToCart,
  onBuyNow,
  resourceDescription,
}) => {
  const userId = Number(localStorage.getItem("userId")); // Lấy userId từ localStorage
  const { courseId } = useParams(); // Course ID từ URL
  const [error, setError] = useState(null); // Quản lý lỗi khi thêm vào wishlist
  const [checkCart, setCheckCart] = useState(false);
  const [checkFavorite, setCheckFavorite] = useState(false);
  const [checkOnStudy, setCheckOnStudy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Hàm gọi API kiểm tra giỏ hàng
    const checkCartStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/cart/check/${userId}/${courseId}`
        );
        setCheckCart(response.data); // Lưu kết quả true/false
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };

    // Hàm gọi API kiểm tra danh sách yêu thích
    const checkFavoriteStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/wishlist/check/${userId}/${courseId}`
        );
        setCheckFavorite(response.data); // Lưu kết quả true/false
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    // Hàm gọi API kiểm tra danh sách đã đăng ký
    const checkOnStudyStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/enrollments/check/${userId}/${courseId}`
        );
        setCheckOnStudy(response.data); // Lưu kết quả true/false
      } catch (error) {
        console.error("Error checking enrollments:", error);
      }
    };

    // Gọi cả ba API khi component được render
    checkCartStatus();
    checkFavoriteStatus();
    checkOnStudyStatus();
  }, [userId, courseId]); // Chỉ chạy khi studentId hoặc courseId thay đổi
  const onGoToCart = () => {
    navigate(`/student/cart`);
  };
  const onStartLearning = () => {
    navigate(`/student/list-my-course`);
  };
  // Hàm thay đổi trạng thái yêu thích và gửi yêu cầu đến API
  const handleFavoriteToggle = async () => {
    setCheckFavorite(!checkFavorite); // Đảo trạng thái yêu thích
    // Gửi request đến API để thêm vào wishlist
    const requestData = {
      userId: userId,
      courseId: courseId,
      createdAt: new Date(), // Thời gian tạo wishlist
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/student/add-wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        if (checkFavorite) {
          toast.success("Xóa khỏi Wishlist thành công");
        } else {
          toast.success("Thêm vào Wishlist thành công");
        }
      } else {
        throw new Error("Đã xảy ra lỗi khi thêm vào wishlist");
      }
    } catch (err) {
      toast.error("Thực hiện thất bại");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg text-center max-w-xs w-full lg:sticky lg:top-24 lg:mr-4 z-10 border-2 border-red-500 ml-[70px]">
      {/* Thumbnail */}
      <img src={thumbnail} alt="Preview" className="w-full mb-4 rounded-lg" />

      {/* Price */}
      <div className="text-3xl font-bold text-gray-800 mb-4">đ {new Intl.NumberFormat("vi-VN").format(price)}</div>

      {/* Add to Cart Button and Heart Icon */}
      <div className="flex items-center justify-between mb-4">
        {/* Nếu đã đăng ký học */}
        {checkOnStudy ? (
          <button
            onClick={onStartLearning} // Gọi hàm khi người dùng nhấn "Học ngay"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-lg w-full hover:bg-blue-700"
          >
            Học ngay
          </button>
        ) : (
          <>
            {/* Nếu có trong giỏ hàng */}
            {checkCart ? (
              <button
                onClick={onGoToCart} // Gọi hàm để chuyển đến giỏ hàng
                className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-lg w-full mr-2 hover:bg-green-700"
              >
                Chuyển đến giỏ hàng
              </button>
            ) : (
              // Nếu không có trong giỏ hàng, hiển thị nút Thêm vào giỏ hàng
              <button
                onClick={onAddToCart}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold text-lg w-full mr-2 hover:bg-purple-700"
              >
                Thêm vào giỏ hàng
              </button>
            )}

            {/* Biểu tượng trái tim (danh sách yêu thích) */}
            <div
              onClick={handleFavoriteToggle}
              className="cursor-pointer w-10 h-10 flex items-center justify-center border-2 border-gray-600 rounded-lg bg-white"
            >
              {checkFavorite ? (
                <AiFillHeart className="text-red-500 text-xl" />
              ) : (
                <AiOutlineHeart className="text-gray-600 text-xl" />
              )}
            </div>
          </>
        )}
      </div>

      {/* Course Details */}
      <div className="text-left text-gray-700">
        <p className="font-semibold mb-2">Khóa học này bao gồm:</p>
        <ul className="space-y-1 mb-4 text-sm">
          {resourceDescription && resourceDescription.length > 0 ? (
            resourceDescription.map((item, index) => (
              <li key={index} className="text-gray-600">
                ✅ {item}
              </li>
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
