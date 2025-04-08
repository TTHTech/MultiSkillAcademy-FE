import React, { useState, useEffect } from "react";

const DiscountCreator = ({discountId}) => {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/admin/discounts/instructor/${discountId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi lấy dữ liệu");
        }
        return response.json();
      })
      .then((data) => {
        setCreator(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-gray-600 font-medium">Đang tải...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-red-500 font-medium">Có lỗi: {error.message}</p>
      </div>
    );

  return (
    <div>
      <div className="mb-2">
        <span className="font-semibold text-white">Họ Tên:</span>{" "}
        <span className="text-gray-200">
          {creator.firstName} {creator.lastName}
        </span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-white">Vai trò:</span>{" "}
        <span className="text-gray-200">
          {creator.userRole === "INSTRUCTOR"
            ? "Giảng viên"
            : creator.userRole === "ADMIN"
            ? "Quản Trị Viên"
            : creator.userRole}
        </span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-white">Email:</span>{" "}
        <span className="text-gray-200">{creator.email}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-white">Số điện thoại:</span>{" "}
        <span className="text-gray-200">
          {creator.phoneNumber ? creator.phoneNumber : "Chưa cập nhật"}
        </span>
      </div>
      <div>
        <span className="font-semibold text-white">Địa chỉ:</span>{" "}
        <span className="text-gray-200">
          {creator.address ? creator.address : "Chưa cập nhật"}
        </span>
      </div>
    </div>
  );
};

export default DiscountCreator;
