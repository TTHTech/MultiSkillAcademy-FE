// src/pages/student/cart/CartPage.jsx
import React from "react";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import CartItems from "../../../components/student/cart/CartItems";
import CartSummary from "../../../components/student/cart/CartSummary";
import RecommendedCoursesList from "../../../components/student/cart/RecommendedCoursesList";
import { ChevronRight } from "lucide-react";

const CartPage = () => {
  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto mt-[90px]">
      <NavBar /> {/* Added NavBar at the top */}
      <div className="container mx-auto p-6 bg-white">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a
            href="/student/home"
            className="hover:text-blue-600 transition-colors duration-200 mt-[50px]"
          >
            Trang chủ
          </a>
          <ChevronRight className="w-4 h-4 mt-[50px]" />
          <span className="text-gray-700 font-medium mt-[50px]">Giỏ hàng</span>
        </div>
        {/* Improved title styling for better visibility */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 pb-4">Giỏ hàng</h1>

        <div className="flex flex-col lg:flex-row justify-between">
          <CartItems />
          <div className="lg:sticky lg:top-24 lg:w-1/3">
            <CartSummary />
          </div>
        </div>

        <RecommendedCoursesList />
      </div>
      <Footer /> {/* Added Footer at the bottom */}
    </div>
  );
};

export default CartPage;
