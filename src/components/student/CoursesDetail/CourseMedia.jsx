import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ListLectureFree from "./ListLectureFree";

const CourseMedia = ({
  price,
  thumbnail = "default-thumbnail.jpg", // Fallback cho thumbnail
  onAddToCart,
  onBuyNow,
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
            axios.get(
              `http://localhost:8080/api/student/cart/check/${userId}/${courseId}`
            ),
            axios.get(
              `http://localhost:8080/api/student/wishlist/check/${userId}/${courseId}`
            ),
            axios.get(
              `http://localhost:8080/api/student/enrollments/check/${userId}/${courseId}`
            ),
            axios.get(
              `http://localhost:8080/api/student/lectures/${courseId}`
            ),
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

  const onGoToCart = () => {
    navigate(`/student/cart`);
  };

  const onStartLearning = () => {
    navigate(`/student/list-my-course`);
  };

  return (
    <div
      className="bg-white p-6 rounded shadow-lg text-center max-w-[500px] w-full border-2 border-red-500"
      style={{
        position: "sticky",
        top: "100px", // Cố định tại vị trí cách đầu trang 100px khi cuộn
      }}
    >
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt="Preview"
        className="w-full h-auto mb-4 rounded-lg"
      />

      {/* Nút xem trước bài giảng */}
      <button
        onClick={() => setShowPreview(true)}
        className="text-blue-500 underline mb-4 text-sm hover:text-blue-700"
      >
        Xem trước khóa học
      </button>

      {/* Modal danh sách bài giảng miễn phí */}
      {showPreview && (
        <ListLectureFree
          onClose={() => setShowPreview(false)}
          lectures={lectures}
        />
      )}

      {/* Giá tiền */}
      <div className="text-3xl font-bold text-gray-800 mb-4">
        đ {new Intl.NumberFormat("vi-VN").format(price || 0)}
      </div>

      {/* Add to Cart Button and Heart Icon */}
      <div className="flex items-center justify-between mb-4">
        {checkOnStudy ? (
          <button
            onClick={onStartLearning}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-lg w-full hover:bg-blue-700"
          >
            Học ngay
          </button>
        ) : (
          <>
            {checkCart ? (
              <button
                onClick={onGoToCart}
                className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-lg w-full mr-2 hover:bg-green-700"
              >
                Chuyển đến giỏ hàng
              </button>
            ) : (
              <button
                onClick={onAddToCart}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold text-lg w-full mr-2 hover:bg-purple-700"
              >
                Thêm vào giỏ hàng
              </button>
            )}

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

      {/* Chi tiết khóa học */}
      <div className="text-left text-gray-700">
        <p className="font-semibold mb-2">Khóa học này bao gồm:</p>
        <ul className="space-y-1 mb-4 text-sm">
          {resourceDescription.length > 0 ? (
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

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CourseMedia;
