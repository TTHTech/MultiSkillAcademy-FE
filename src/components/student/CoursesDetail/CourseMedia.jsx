import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlinePlayCircle } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ListLectureFree from "./ListLectureFree";

const CourseMedia = ({
  price,
  thumbnail = "default-thumbnail.jpg",
  onAddToCart,
  resourceDescription = [],
}) => {
  const userId = Number(localStorage.getItem("userId"));
  const { courseId } = useParams();
  const [error, setError] = useState(null);
  const [checkCart, setCheckCart] = useState(false);
  const [checkFavorite, setCheckFavorite] = useState(false);
  const [checkOnStudy, setCheckOnStudy] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lectures, setLectures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatusesAndLectures = async () => {
      try {
        const [cartResponse, favoriteResponse, studyResponse, lecturesResponse] =
          await Promise.all([
            axios.get(`http://localhost:8080/api/student/cart/check/${userId}/${courseId}`),
            axios.get(`http://localhost:8080/api/student/wishlist/check/${userId}/${courseId}`),
            axios.get(`http://localhost:8080/api/student/enrollments/check/${userId}/${courseId}`),
            axios.get(`http://localhost:8080/api/student/lectures/${courseId}`),
          ]);

        setCheckCart(cartResponse.data);
        setCheckFavorite(favoriteResponse.data);
        setCheckOnStudy(studyResponse.data);
        setLectures(lecturesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu, vui lòng thử lại sau.");
      }
    };

    if (userId && courseId) {
      fetchStatusesAndLectures();
    } else {
      setError("Không tìm thấy mã người dùng hoặc mã khóa học.");
    }
  }, [userId, courseId]);

  const handleFavoriteToggle = async () => {
    setCheckFavorite(!checkFavorite);

    const requestData = {
      userId,
      courseId,
      createdAt: new Date(),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/student/add-wishlist",
        requestData
      );

      if (response.status === 200) {
        toast.success(
          checkFavorite
            ? "Xóa khỏi Wishlist thành công"
            : "Thêm vào Wishlist thành công"
        );
      } else {
        throw new Error("Không thể cập nhật danh sách yêu thích.");
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      toast.error("Thực hiện thất bại.");
    }
  };

  const onGoToCart = () => navigate(`/student/cart`);
  const onStartLearning = () => navigate(`/student/list-my-course`);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-[400px] w-full sticky top-[100px] overflow-hidden">
      {/* Thumbnail */}
      <div className="relative group">
        <img
          src={thumbnail}
          alt="Course Preview"
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => setShowPreview(true)}
            className="flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <AiOutlinePlayCircle className="text-white text-5xl mb-2" />
            <span className="text-white font-medium">Xem trước khóa học</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Price */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat("vi-VN").format(price || 0)} VND
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Hoàn tiền trong 30 ngày nếu không hài lòng
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-6">
          {checkOnStudy ? (
            <button
              onClick={onStartLearning}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Học ngay
            </button>
          ) : (
            <>
              <button
                onClick={checkCart ? onGoToCart : onAddToCart}
                className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                  checkCart
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                }`}
              >
                {checkCart ? "Chuyển đến giỏ hàng" : "Thêm vào giỏ hàng"}
              </button>

              <button
                onClick={handleFavoriteToggle}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300 group"
              >
                {checkFavorite ? (
                  <AiFillHeart className="text-2xl text-red-500 group-hover:scale-110 transition-transform" />
                ) : (
                  <AiOutlineHeart className="text-2xl text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Course Details */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Khóa học này bao gồm:
          </h3>
          <ul className="space-y-3">
            {resourceDescription.length > 0 ? (
              resourceDescription.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <span className="w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-200 transition-colors">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic text-center py-4">
                Chưa có thông tin về tài nguyên khóa học
              </li>
            )}
          </ul>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <ListLectureFree
          onClose={() => setShowPreview(false)}
          lectures={lectures}
        />
      )}
    </div>
  );
};

export default CourseMedia;