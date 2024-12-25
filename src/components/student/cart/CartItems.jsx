import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  // State to store cart items
  const [cartItems, setCartItems] = useState([]);
  // State to store loading status
  const [loading, setLoading] = useState(true);
  // State to store any error
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch cart items
    const fetchCartItems = async () => {
      try {
        // Get the token from localStorage (or wherever it's stored)
        const token = localStorage.getItem("token");

        // Make the GET request to fetch cart items
        const response = await axios.get(
          "http://localhost:8080/api/student/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if data is in the expected format (array of items)
        if (Array.isArray(response.data)) {
          setCartItems(response.data); // Set the cart items into state
        } else {
          setError("Dữ liệu không hợp lệ");
          toast.error("Dữ liệu không hợp lệ"); // Thông báo lỗi
        }
      } catch (err) {
        // Handle errors
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
        toast.error("Có lỗi xảy ra khi tải dữ liệu."); // Thông báo lỗi khi không thể tải dữ liệu
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []); // The empty array ensures this runs only once when the component mounts

  // Function to delete a course from the cart
  const deleteCourseFromCart = async (courseId) => {
    try {
      // Get the token from localStorage (or wherever it's stored)
      const token = localStorage.getItem("token");

      // Make the DELETE request to remove the course from the cart
      await axios.delete(
        `http://localhost:8080/api/student/cart/remove/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the course from the state
      setCartItems(cartItems.filter((item) => item.courseId !== courseId));

      // Thông báo thành công
      toast.success("Khóa học đã được xóa khỏi giỏ hàng!");
      setTimeout(function() {
        window.location.reload();
    }, 2000);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi xóa khóa học.");
      toast.error("Có lỗi xảy ra khi xóa khóa học."); // Thông báo lỗi khi không thể xóa khóa học
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
      // Cập nhật UI sau khi chuyển thành công
      setCartItems(cartItems.filter((item) => item.courseId !== courseId));
      toast.success(response.data); // Thông báo từ backend
      setTimeout(function() {
        window.location.reload();
    }, 2000);
    } catch (err) {
      console.error(err);

      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          toast.error(data); // Lỗi logic từ backend
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

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>;
  }
  const handleClickItemItem = (courseId) => {
    navigate(`/course/${courseId}`);
  };
  // Render cart items
  return (
    <div className="lg:w-2/3 space-y-4 from-yellow-50 to-purple-100 ml-[30px]">
      <p className="text-lg font-semibold text-gray-900">
        {cartItems.length} khóa học trong giỏ hàng
      </p>
      <hr className="border-gray-300 mb-4" />
      {cartItems.map((item, index) => (
        <div
          key={index}
          className="flex items-start space-x-4 border-b pb-4 mb-4"
        >
          {/* Thumbnail Image */}
          <img
            src={item.courseImageUrl} // Use courseImageUrl for the image
            alt={item.courseTitle}
            className="w-24 h-24 object-cover rounded"
            onClick={() => handleClickItemItem(item.courseId)}
          />
          <div className="flex-1">
            {/* Course Title */}
            <h2
              className="text-xl font-semibold text-gray-900"
              onClick={() => handleClickItemItem(item.courseId)}
            >
              {item.courseTitle}
            </h2>
            {/* Instructor */}
            <p
              className="text-sm text-gray-600"
              onClick={() => handleClickItemItem(item.courseId)}
            >
              Bởi {item.instructorName}
            </p>
            <div
              className="flex items-center space-x-2 mt-2"
              onClick={() => handleClickItemItem(item.courseId)}
            >
              {/* Rating */}
              <span className="text-sm text-yellow-600 font-semibold">
                {item.rating} ★ ({item.reviewCount} xếp hạng)
              </span>
            </div>
            {/* Course Details */}
            <p
              className="text-sm text-gray-600 mt-2"
              onClick={() => handleClickItemItem(item.courseId)}
            >
              Tổng số giờ: {item.hours} • Bài giảng: {item.lectures} • Trình độ:{" "}
              {item.level}
            </p>
            {/* Actions */}
            <div className="flex space-x-4 text-purple-700 mt-2 font-semibold">
              {/*<button className="underline hover:text-purple-900">Lưu để mua sau</button>*/}
              <button
                className="underline hover:text-purple-900"
                onClick={() => moveCourseToWishlist(item.courseId)}
              >
                Chuyển vào danh sách mong ước
              </button>
              {/* Delete Button */}
              <button
                className="underline hover:text-purple-900"
                onClick={() => deleteCourseFromCart(item.courseId)} // Call delete function when clicked
              >
                Xóa
              </button>
            </div>
          </div>
          {/* Course Price */}
          <p className="text-xl font-bold text-gray-900">
            {new Intl.NumberFormat("vi-VN").format(item.price)}₫
          </p>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
