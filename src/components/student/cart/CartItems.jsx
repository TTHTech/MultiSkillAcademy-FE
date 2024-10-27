// src/components/student/cart/CartItems.jsx
import React from "react";

const cartItems = [
  {
    title: "React State Manager - Redux Toolkit, React Query, Redux Saga",
    instructor: "Hỏi Dân IT với Eric",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.8,
    reviews: 149,
    hours: "13 giờ",
    lectures: 102,
    level: "Tất cả trình độ",
    price: "₫ 2.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "Advanced NodeJS Development",
    instructor: "John Doe",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.7,
    reviews: 135,
    hours: "15 giờ",
    lectures: 85,
    level: "Trung cấp",
    price: "₫ 1.299.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "Full Stack Web Development",
    instructor: "Jane Smith",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.9,
    reviews: 412,
    hours: "40 giờ",
    lectures: 250,
    level: "Nâng cao",
    price: "₫ 2.199.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "Python for Data Science",
    instructor: "Emily Nguyen",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.6,
    reviews: 203,
    hours: "20 giờ",
    lectures: 120,
    level: "Cơ bản",
    price: "₫ 1.599.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "Machine Learning A-Z",
    instructor: "Michael Truong",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.8,
    reviews: 322,
    hours: "30 giờ",
    lectures: 180,
    level: "Trung cấp",
    price: "₫ 2.799.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "Cybersecurity Essentials",
    instructor: "David Le",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.5,
    reviews: 159,
    hours: "18 giờ",
    lectures: 95,
    level: "Tất cả trình độ",
    price: "₫ 1.999.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "AWS Cloud for Beginners",
    instructor: "Linh Nguyen",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.8,
    reviews: 748,
    hours: "22 giờ",
    lectures: 130,
    level: "Cơ bản",
    price: "₫ 1.799.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "DevOps on AWS for Beginner",
    instructor: "Linh Nguyen",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.8,
    reviews: 183,
    hours: "25 giờ",
    lectures: 140,
    level: "Tất cả trình độ",
    price: "₫ 1.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "Figma từ cơ bản đến nâng cao",
    instructor: "Lưu Trọng Nhân",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.8,
    reviews: 247,
    hours: "12 giờ",
    lectures: 60,
    level: "Trung cấp",
    price: "₫ 549.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
  {
    title: "Angular and TypeScript",
    instructor: "TU Tran",
    lastUpdated: "Đã cập nhật gần đây",
    rating: 4.2,
    reviews: 12,
    hours: "15 giờ",
    lectures: 80,
    level: "Cơ bản",
    price: "₫ 399.000",
    thumbnail: "https://th.bing.com/th/id/OIP.NQKkUVVsVZjej-ZnvkSKHwHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6",
  },
];

const CartItems = () => {
  return (
    <div className="lg:w-2/3 space-y-4">
      <p className="text-lg font-semibold text-gray-900">{cartItems.length} khóa học trong giỏ hàng</p>
      <hr className="border-gray-300 mb-4" /> {/* Horizontal separator */}
      {cartItems.map((item, index) => (
        <div key={index} className="flex items-start space-x-4 border-b pb-4 mb-4">
          <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover rounded" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
            <p className="text-sm text-gray-600">Bởi {item.instructor}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{item.lastUpdated}</span>
              <span className="text-sm text-yellow-600 font-semibold">{item.rating} ★ ({item.reviews} xếp hạng)</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Tổng số {item.hours} • {item.lectures} bài giảng • {item.level}
            </p>
            <div className="flex space-x-4 text-purple-700 mt-2 font-semibold">
              <button className="underline hover:text-purple-900">Lưu để mua sau</button>
              <button className="underline hover:text-purple-900">Chuyển vào danh sách mong ước</button>
              <button className="underline hover:text-purple-900">Xóa</button>
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900">{item.price}</p>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
