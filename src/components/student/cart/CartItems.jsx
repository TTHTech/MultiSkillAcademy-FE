import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Book, BarChart, Heart, Trash2, ChevronRight } from 'lucide-react';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Existing useEffect and functions remain the same
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/student/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          setError("Dữ liệu không hợp lệ");
          toast.error("Dữ liệu không hợp lệ");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
        toast.error("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const deleteCourseFromCart = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/student/cart/remove/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(cartItems.filter((item) => item.courseId !== courseId));
      toast.success("Khóa học đã được xóa khỏi giỏ hàng!");
      setTimeout(function() {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi xóa khóa học.");
      toast.error("Có lỗi xảy ra khi xóa khóa học.");
    }
  };

  const moveCourseToWishlist = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        `http://localhost:8080/api/student/cart/move-wishlist/${courseId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(cartItems.filter((item) => item.courseId !== courseId));
      toast.success(response.data);
      setTimeout(function() {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          toast.error(data);
        } else if (status === 404) {
          toast.error("Không tìm thấy dữ liệu cần thiết.");
        } else {
          toast.error("Đã xảy ra lỗi không xác định.");
        }
      } else {
        toast.error("Không thể kết nối đến máy chủ.");
      }
    }
  };

  const handleClickItemItem = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="lg:w-2/3 space-y-6 ml-8">
      {/* Cart Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Giỏ hàng của bạn
          </h1>
          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            {cartItems.length} khóa học
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
          >
            <div className="p-6 flex gap-6">
              {/* Course Image */}
              <div className="relative flex-shrink-0" onClick={() => handleClickItemItem(item.courseId)}>
                <img
                  src={item.courseImageUrl}
                  alt={item.courseTitle}
                  className="w-48 h-32 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <div onClick={() => handleClickItemItem(item.courseId)}>
                  <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2">
                    {item.courseTitle}
                  </h2>
                  
                  <p className="text-gray-600 mb-2 flex items-center gap-1">
                    Bởi <span className="font-medium text-gray-900">{item.instructorName}</span>
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{item.rating}</span>
                      <span className="text-gray-500">({item.reviewCount} xếp hạng)</span>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.hours} giờ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Book className="w-4 h-4" />
                      <span>{item.lectures} bài giảng</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart className="w-4 h-4" />
                      <span>{item.level}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => moveCourseToWishlist(item.courseId)}
                      className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Thêm vào mong muốn</span>
                    </button>
                    <button
                      onClick={() => deleteCourseFromCart(item.courseId)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat("vi-VN").format(item.price)}₫
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="mx-auto w-16 h-16 mb-4">
              🛒
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-600">Hãy thêm một số khóa học vào giỏ hàng của bạn</p>
          </div>
          <button
            onClick={() => navigate('/student/home')}
            className="mt-4 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Khám phá khóa học
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItems;