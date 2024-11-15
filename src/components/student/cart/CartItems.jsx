import React, { useEffect, useState } from "react";
import axios from "axios";

const CartItems = () => {
  // State to store cart items
  const [cartItems, setCartItems] = useState([]);
  // State to store loading status
  const [loading, setLoading] = useState(true);
  // State to store any error
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch cart items
    const fetchCartItems = async () => {
      try {
        // Get the token from localStorage (or wherever it's stored)
        const token = localStorage.getItem("token"); // Or use another method for storing/retrieving the token

        // Make the GET request to fetch cart items
        const response = await axios.get("http://localhost:8080/api/student/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the response data to check its structure
        console.log(response.data);

        // Check if data is in the expected format (array of items)
        if (Array.isArray(response.data)) {
          setCartItems(response.data); // Set the cart items into state
        } else {
          setError("Dữ liệu không hợp lệ");
        }
      } catch (err) {
        // Handle errors
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
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
      await axios.delete(`http://localhost:8080/api/student/cart/remove/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the course from the state
      setCartItems(cartItems.filter(item => item.courseId !== courseId));
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi xóa khóa học.");
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

  // Render cart items
  return (
    <div className="lg:w-2/3 space-y-4">
      <p className="text-lg font-semibold text-gray-900">
        {cartItems.length} khóa học trong giỏ hàng
      </p>
      <hr className="border-gray-300 mb-4" />
      {cartItems.map((item, index) => (
        <div key={index} className="flex items-start space-x-4 border-b pb-4 mb-4">
          {/* Thumbnail Image */}
          <img
            src={item.courseImageUrl} // Use courseImageUrl for the image
            alt={item.courseTitle}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1">
            {/* Course Title */}
            <h2 className="text-xl font-semibold text-gray-900">{item.courseTitle}</h2>
            {/* Instructor */}
            <p className="text-sm text-gray-600">Bởi {item.instructorName}</p>
            <div className="flex items-center space-x-2 mt-2">
              {/* Rating */}
              <span className="text-sm text-yellow-600 font-semibold">
                {item.rating} ★ ({item.reviewCount} xếp hạng)
              </span>
            </div>
            {/* Course Details */}
            <p className="text-sm text-gray-600 mt-2">
              Tổng số giờ: {item.hours} • Bài giảng: {item.lectures} • Trình độ: {item.level}
            </p>
            {/* Actions */}
            <div className="flex space-x-4 text-purple-700 mt-2 font-semibold">
              <button className="underline hover:text-purple-900">Lưu để mua sau</button>
              <button className="underline hover:text-purple-900">Chuyển vào danh sách mong ước</button>
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
          <p className="text-xl font-bold text-gray-900">{item.price}₫</p>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
