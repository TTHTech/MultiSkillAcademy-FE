import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications

const CartSummary = () => {
  // State to store the total amount
  const [totalAmount, setTotalAmount] = useState(null);
  // State to store the coupon code
  const [coupon, setCoupon] = useState("");
  // State to handle loading state
  const [loading, setLoading] = useState(true);
  // State to handle any error
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch total price from API
    const fetchTotalAmount = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8080/api/student/cart/total", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTotalAmount(response.data); // Assuming response data contains the total amount
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalAmount();
  }, []);

  // Function to handle payment process
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // Call API to create VNPay payment URL
      const response = await axios.get(
        `http://localhost:8080/api/student/vn-pay?totalAmount=${totalAmount}&couponCode=${coupon}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check if the payment URL was successfully generated
      if (response.data.code === "00") {
        const paymentUrl = response.data.paymentUrl;
        // Redirect to VNPay payment page
        window.location.href = paymentUrl;
      } else {
        toast.error("Không thể tạo link thanh toán.");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo thanh toán.");
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

  return (
    <div className="max-w-xs mx-auto from-yellow-50 to-purple-100 p-6 rounded-lg shadow-md lg:sticky lg:top-24 ml-[100px]">
      <div className="text-lg font-bold mb-2 text-gray-900">Tổng:</div>
      <p className="text-3xl font-bold text-purple-700 mb-4">
        {totalAmount !== null ? `₫ ${totalAmount.toLocaleString()}` : "₫ 0"}
      </p>

      {/* Payment Button */}
      <button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg mb-4"
        onClick={handlePayment}
      >
        Thanh toán
      </button>

      {/* Coupon Input */}
      <div className="mt-2">
        <label htmlFor="coupon" className="block text-gray-700 mb-2">
          Khuyến mãi
        </label>
        <div className="flex">
          <input
            type="text"
            id="coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)} // Update coupon state
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
