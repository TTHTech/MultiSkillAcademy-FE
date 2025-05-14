import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Book,
  BarChart,
  Heart,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { encodeId } from "../../../utils/hash";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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
        const response = await axios.get(`${baseUrl}/api/student/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
      await axios.delete(`${baseUrl}/api/student/cart/remove/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(cartItems.filter((item) => item.courseId !== courseId));
      toast.success("Khóa học đã được xóa khỏi giỏ hàng!");
      setTimeout(function () {
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
        `${baseUrl}/api/student/cart/move-wishlist/${courseId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(cartItems.filter((item) => item.courseId !== courseId));
      toast.success(response.data);
      setTimeout(function () {
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
  const formatter = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const handleClickItemItem = (courseId) => {
    navigate(`/course/${encodeId(courseId)}`);
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
    <div className="lg:w-2/3 space-y-6">
      {/* Cart Header - Improved styling */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Giỏ hàng của bạn
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Quản lý các khóa học bạn muốn mua
              </p>
            </div>
          </div>
          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 12H4"
              />
            </svg>
            {cartItems.length} khóa học
          </span>
        </div>
      </div>

      {/* Cart Items - Enhanced design */}
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100"
          >
            <div className="p-6 flex gap-8">
              {/* Course Image - Improved styling */}
              <div
                className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl"
                onClick={() => handleClickItemItem(item.courseId)}
              >
                <img
                  src={item.courseImageUrl}
                  alt={item.courseTitle}
                  className="w-56 h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
              </div>

              {/* Course Info - Enhanced layout */}
              <div className="flex-1 min-w-0">
                <div
                  onClick={() => handleClickItemItem(item.courseId)}
                  className="cursor-pointer"
                >
                  <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
                    {item.courseTitle}
                  </h2>

                  <p className="text-gray-600 mb-3 flex items-center gap-2">
                    Giảng viên:{" "}
                    <span className="font-medium text-gray-900">
                      {item.instructorName}
                    </span>
                  </p>

                  {/* Rating - Improved visualization */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-yellow-700">
                        {item.rating}
                      </span>
                      <span className="text-yellow-600">
                        ({item.reviewCount})
                      </span>
                    </div>
                    <div className="h-5 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{item.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Book className="w-4 h-4 text-gray-400" />
                        <span>{item.lectures} bài giảng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-gray-400" />
                        <span>{item.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Enhanced buttons */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveCourseToWishlist(item.courseId);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Yêu thích</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCourseFromCart(item.courseId);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa</span>
                      </button>
                    </div>
                    {item.discount > 0 ? (
                      <div className="space-y-1">
                        <div className="text-base text-gray-500 line-through">
                          {formatter.format(item.price)}₫
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatter.format(
                            Math.floor(item.price * (1 - item.discount / 100))
                          )}
                          ₫
                        </div>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-blue-600">
                        {formatter.format(item.price)}₫
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty Cart State - Enhanced design */}
      {cartItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="max-w-sm mx-auto">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-600">
                Hãy khám phá và thêm các khóa học yêu thích vào giỏ hàng của bạn
              </p>
            </div>
            <button
              onClick={() => navigate("/student/home")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Khám phá khóa học
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
