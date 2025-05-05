import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const CartSummary = () => {
  const [totalAmount, setTotalAmount] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [coursesApplyPromotion, setCourseApplyPromotion] = useState();

  const fetchTotalAmount = async (appliedCoupon = "") => {
    try {
      const token = localStorage.getItem("token");
      let url = `${baseUrl}/api/student/cart/total`;
      if (appliedCoupon) {
        url += `?couponCode=${appliedCoupon}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalAmount(response.data);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const getCourseApplyPromotion = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${baseUrl}/api/student/cart/course-apply-promotion/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourseApplyPromotion(response.data);
      console.log(response.data);
    } catch (error) {
      // toast.error(error.response?.data || "Error applying discount");
    }
  }
  const handleApplyDiscountUsage = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      await axios.post(
        `${baseUrl}/api/student/discount-usage/applyDiscount?userId=${userId}&codeDiscount=${coupon}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Discount applied successfully");
    } catch (error) {
      // toast.error(error.response?.data || "Error applying discount");
    }
  };
  const handleApplyPromotionUsage = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const validCourses = coursesApplyPromotion.filter(item => item.promotionId != null);
    if (validCourses.length === 0) {
      alert("Không có khuyến mãi nào để áp dụng");
      return;
    }
    try {
      const requests = validCourses.map(item => {
        return axios.post(
          `${baseUrl}/api/student/promotion/applyPromotion`,
          null,
          {
            params: {
              userId,
              promotionId: item.promotionId,
              courseId: item.courseId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });
      await Promise.all(requests);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTotalAmount();
    getCourseApplyPromotion();
  }, []);

  const handleApplyCoupon = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `${baseUrl}/api/student/discount-usage/check/${coupon}/${userId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.apply) {
        const courses = response.data.coursesApply;
        const slimCourses = courses.map(({ courseId, promotionId }) => ({
          courseId,
          promotionId,
        }));
        setCourseApplyPromotion(null);
        setCourseApplyPromotion(slimCourses);
        const message = `Mã giảm giá hợp lệ. Áp dụng cho: ${courses
          .map((course) => {
            const discount = `${Math.round(course.reducedAmount).toLocaleString(
              "vi-VN"
            )}₫`;
            let promotionNote = "";
            if (course.applyWithPromotion === true) {
              promotionNote =
                " (giảm " +
                discount +
                ", Discount có áp dụng chung với khuyến mãi)";
            } else if (course.applyWithPromotion === false) {
              promotionNote =
                " (giảm " +
                discount +
                ", Discount không áp dụng chung với khuyến mãi)";
            } else {
              promotionNote = " (giảm " + discount + ")";
            }
            return `${course.title}${promotionNote}`;
          })
          .join(", ")}`;
        setCouponMessage(message);
        toast.success("Mã giảm giá hợp lệ.");
        fetchTotalAmount(coupon);
        console.log(coursesApplyPromotion);
      } else {
        setCouponMessage(
          "Mã giảm giá không áp dụng cho bất kỳ khóa học nào trong giỏ hàng của bạn."
        );
        toast.info("Mã giảm giá không áp dụng cho khóa học nào.");
        fetchTotalAmount();
      }
    } catch (err) {
      setCouponMessage("Có lỗi xảy ra khi kiểm tra mã giảm giá.");
      toast.error("Có lỗi xảy ra khi kiểm tra mã giảm giá.");
    }
  };

  const handlePayment = async () => {
    try {
      localStorage.setItem("appliedCoupon", coupon);
      // const discount = localStorage.getItem("appliedCoupon");
      // toast.error("Discount : " + discount);
      const token = localStorage.getItem("token");

      //đặt lưu người sử dụng discount
      handleApplyDiscountUsage();
      handleApplyPromotionUsage();

      const response = await axios.get(
        `${baseUrl}/api/student/vn-pay?totalAmount=${totalAmount}&couponCode=${coupon}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code === "00") {
        const paymentUrl = response.data.paymentUrl;
        window.location.href = paymentUrl;
      } else {
        toast.error("Không thể tạo link thanh toán.");
        localStorage.removeItem("appliedCoupon");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo thanh toán.");
      localStorage.removeItem("appliedCoupon");
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-2xl shadow-md animate-pulse bg-white">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded mb-8"></div>
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
        <p className="text-red-600 text-center font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg lg:sticky lg:top-24 transform transition-all duration-300 hover:shadow-xl">
      {/* Header Section with enhanced styling */}
      <div className="text-center mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Tổng thanh toán
        </h2>
        <p className="text-4xl font-bold text-purple-600 tracking-tight">
          {totalAmount !== null
            ? `₫ ${Math.round(totalAmount).toLocaleString("vi-VN")}`
            : "₫ 0"}
        </p>
      </div>

      {/* Coupon Section with improved layout */}
      <div className="mb-8">
        <label
          htmlFor="coupon"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Mã khuyến mãi
        </label>
        <div className="flex space-x-3">
          <input
            type="text"
            id="coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Nhập mã giảm giá của bạn"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200
                     hover:border-gray-300"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 
                     transition-colors duration-200 font-medium focus:outline-none 
                     focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Áp dụng
          </button>
        </div>
        {couponMessage && (
          <p className="mt-2 text-sm text-gray-600">{couponMessage}</p>
        )}
      </div>

      {/* Payment Button with enhanced styling */}
      <button
        onClick={handlePayment}
        className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg
                 hover:bg-purple-700 transform transition-all duration-200 
                 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 
                 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                 mb-6"
      >
        Thanh toán ngay
      </button>

      {/* Footer Information with improved styling */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-sm text-gray-600 font-medium">
            Thanh toán an toàn qua VNPay
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Giao dịch của bạn được bảo mật và mã hóa
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
