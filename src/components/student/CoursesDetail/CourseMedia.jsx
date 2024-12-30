import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
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
      className="bg-white p-6 rounded-lg shadow-xl text-center max-w-[500px] w-full border border-gray-300 ml-[30px]"
      style={{
        position: "sticky",
        top: "100px", // Fixed at 100px from the top when scrolling
      }}
    >
      {/* Thumbnail */}
      <div className="relative mb-6">
        <img
          src={thumbnail}
          alt="Preview"
          className="w-full h-auto rounded-lg shadow-md border-4 border-gray-200 hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
        />
      </div>

     

      {/* Preview Lectures Button */}
      <button
        onClick={() => setShowPreview(true)}
        className="text-blue-600 font-medium underline hover:text-blue-800 transition-colors mb-6"
      >
        Xem trước khóa học
      </button>
       {/* Price */}
       <div className="text-4xl font-bold text-gray-900 mb-6">
        {new Intl.NumberFormat("vi-VN").format(price || 0)} VND
     </div>
      {/* Modal for Free Lecture Previews */}
      {showPreview && (
        <ListLectureFree
          onClose={() => setShowPreview(false)}
          lectures={lectures}
        />
      )}

      {/* Buttons for Cart and Wishlist */}
      <div className="flex items-center justify-between mb-6">
        {checkOnStudy ? (
          <button
            onClick={onStartLearning}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 w-full"
          >
            Học ngay
          </button>
        ) : (
          <>
            {checkCart ? (
              <button
                onClick={onGoToCart}
                className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-600 w-full mr-4"
              >
                Chuyển đến giỏ hàng
              </button>
            ) : (
              <button
                onClick={onAddToCart}
                className="bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-purple-600 w-full mr-4"
              >
                Thêm vào giỏ hàng
              </button>
            )}

            <div
              onClick={handleFavoriteToggle}
              className="cursor-pointer w-12 h-12 flex items-center justify-center border border-gray-300 rounded-full bg-white shadow hover:shadow-lg"
            >
              {checkFavorite ? (
                <AiFillHeart className="text-red-500 text-2xl" />
              ) : (
                <AiOutlineHeart className="text-gray-500 text-2xl" />
              )}
            </div>
          </>
        )}
      </div>

      {/* Course Details */}
      <div className="text-left text-gray-700">
        <p className="font-semibold mb-3 text-lg">Khóa học này bao gồm:</p>
        <ul className="space-y-2 mb-4">
          {resourceDescription.length > 0 ? (
            resourceDescription.map((item, index) => (
              <li key={index} className="text-gray-600 flex items-center">
                <span className="mr-2">✅</span>{item}
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
