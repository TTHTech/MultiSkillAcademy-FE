import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const DiscountUsageUI = ({discountId}) => {
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = Number(localStorage.getItem("userId"));
  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray)) return "N/A";
    const [year, month, day, hour, minute, second] = dateArray;
    const dateObj = new Date(year, month - 1, day, hour, minute, second);
    return dateObj.toLocaleDateString("vi-VN");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseUrl}/api/instructor/discounts/discount-usage/${userId}/${discountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setDiscount(response.data[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching discount data:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu discount.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, discountId]);

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!discount) return <div className="text-center py-10">Không có dữ liệu discount.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {discount.discountName}{" "}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700 text-sm">
              <strong>Discount Type:</strong> {discount.discountType}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Description:</strong> {discount.description}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Usage Limit:</strong> {discount.usageLimit}
            </p>
          </div>
          <div>
            <p className="text-gray-700 text-sm">
              <strong>Usage Count:</strong> {discount.usageCount}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Total Discount Amount:</strong> {discount.totalDiscountAmount}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Start Date:</strong> {formatDate(discount.startDate)}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>End Date:</strong> {formatDate(discount.endDate)}
            </p>
          </div>
        </div>

        {/* Applied Courses */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Applied Courses
          </h2>
          {discount.appliedCourseIds && discount.appliedCourseIds.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-700 text-sm">
              {discount.appliedCourseIds.map((course) => (
                <li key={course.courseId}>
                  {course.title}{" "}
                  <span className="text-sm text-gray-500">({course.courseId})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">Không có khóa học được áp dụng.</p>
          )}
        </div>

        {/* User Discount Usages */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            User Discount Usages
          </h2>
          {discount.userDiscountUsages && discount.userDiscountUsages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm">
                    <th className="py-2 px-4 border">User ID</th>
                    <th className="py-2 px-4 border">Username</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Course</th>
                    <th className="py-2 px-4 border">Discount Amount</th>
                    <th className="py-2 px-4 border">Used At</th>
                  </tr>
                </thead>
                <tbody>
                  {discount.userDiscountUsages.map((usage, idx) => (
                    <tr key={idx} className="text-sm text-gray-700">
                      <td className="py-2 px-4 border text-center">{usage.userId}</td>
                      <td className="py-2 px-4 border">{usage.username}</td>
                      <td className="py-2 px-4 border">{usage.email}</td>
                      <td className="py-2 px-4 border">
                        {usage.courseTitle}{" "}
                        <span className="text-sm text-gray-500">({usage.courseId})</span>
                      </td>
                      <td className="py-2 px-4 border text-center">{usage.discountAmount}</td>
                      <td className="py-2 px-4 border text-center">
                        {formatDate(usage.usedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Không có lượt sử dụng discount nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountUsageUI;