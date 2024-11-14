import React, { useEffect, useState } from "react";
import axios from "axios";

const CartSummary = () => {
  // State to store the total amount
  const [totalAmount, setTotalAmount] = useState(null);
  // State to handle loading state
  const [loading, setLoading] = useState(true);
  // State to handle any error
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch total price from API
    const fetchTotalAmount = async () => {
      try {
        // Get the token from localStorage (or wherever it's stored)
        const token = localStorage.getItem("token"); // Or use another method for storing/retrieving the token

        // Make the GET request to fetch the total amount from the API
        const response = await axios.get("http://localhost:8080/api/student/cart/total", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the total amount in the state
        setTotalAmount(response.data); // Assuming the response contains the total price as a number
      } catch (err) {
        // Handle any errors during the API request
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false); // Set loading to false once the request is finished
      }
    };

    // Call the function to fetch the total amount
    fetchTotalAmount();
  }, []); // This ensures it runs only once when the component mounts

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-xs mx-auto bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-24">
      <div className="text-lg font-bold mb-2 text-gray-900">Tổng:</div>
      <p className="text-3xl font-bold text-purple-700 mb-4">
        {totalAmount !== null ? `₫ ${totalAmount.toLocaleString()}` : "₫ 0"}
      </p>

      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg mb-4">
        Thanh toán
      </button>

      <div className="mt-2">
        <label htmlFor="coupon" className="block text-gray-700 mb-2">Khuyến mãi</label>
        <div className="flex">
          <input
            type="text"
            id="coupon"
            placeholder="Nhập coupon"
            className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg">
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
