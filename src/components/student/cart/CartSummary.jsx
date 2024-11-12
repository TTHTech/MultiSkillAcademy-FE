// src/components/student/cart/CartSummary.jsx
import React from "react";

const CartSummary = () => {
  const totalAmount = "₫ 3.398.000"; // Example total

  return (
    <div className="max-w-xs mx-auto bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-24">
      <div className="text-lg font-bold mb-2 text-gray-900">Tổng:</div>
      <p className="text-3xl font-bold text-purple-700 mb-4">{totalAmount}</p>

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
