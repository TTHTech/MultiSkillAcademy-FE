import { useEffect, useState } from "react";
import axios from "axios";

const DiscountUsageList = () => {
  const [discountUsages, setDiscountUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDiscountUsage = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/discount-usage",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDiscountUsages(response.data);
      } catch (err) {
        setError("Không thể tải danh sách Discount Usage.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscountUsage();
  }, [token]);

  if (loading) return <p className="text-white p-4">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-4 text-white">
      <h2 className="text-2xl font-bold mb-6">Discount Usage</h2>
      {discountUsages.map((discount) => (
        <div
          key={discount.discountId}
          className="mb-8 border border-gray-600 rounded p-4"
        >
          {/* Header: Discount name, code and value */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-xl font-semibold">
                {discount.discountName} ({discount.discountCode})
              </h3>
              <p className="text-sm text-gray-300">
                {discount.discountType === "PERCENTAGE"
                  ? `${discount.discountValue}%`
                  : `${discount.discountValue} VND`}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                discount.discountType === "PERCENTAGE"
                  ? "bg-blue-500"
                  : "bg-green-500"
              }`}
            >
              {discount.discountType}
            </span>
          </div>
          {/* Description and general info */}
          <p className="mb-2">{discount.description}</p>
          <div className="flex flex-wrap gap-4 text-sm mb-2">
            <div>
              <span className="font-semibold">Eligible:</span> {discount.eligibleUsers}
            </div>
            <div>
              <span className="font-semibold">Usage Limit:</span> {discount.usageLimit}
            </div>
            <div>
              <span className="font-semibold">Used:</span> {discount.usageCount}
            </div>
            <div>
              <span className="font-semibold">Total Discount:</span> {discount.totalDiscountAmount}
            </div>
          </div>
          {/* Dates */}
          <div className="text-sm mb-2">
            <span className="font-semibold">Start Date:</span>{" "}
            {new Date(...discount.startDate).toLocaleString("vi-VN")}
          </div>
          <div className="text-sm mb-4">
            <span className="font-semibold">End Date:</span>{" "}
            {new Date(...discount.endDate).toLocaleString("vi-VN")}
          </div>
          {/* Applied Courses */}
          {discount.appliedCourseIds && discount.appliedCourseIds.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Applied Courses:</h4>
              <ul className="list-disc ml-5 text-sm">
                {discount.appliedCourseIds.map((course) => (
                  <li key={course.courseId}>
                    {course.title} ({course.courseId})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* User Discount Usages */}
          {discount.userDiscountUsages && discount.userDiscountUsages.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">User Discount Usages:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-white text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-3 border border-gray-600">User ID</th>
                      <th className="py-2 px-3 border border-gray-600">Username</th>
                      <th className="py-2 px-3 border border-gray-600">Email</th>
                      <th className="py-2 px-3 border border-gray-600">Course</th>
                      <th className="py-2 px-3 border border-gray-600">Discount</th>
                      <th className="py-2 px-3 border border-gray-600">Used At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discount.userDiscountUsages.map((usage, idx) => (
                      <tr
                        key={`${usage.userId}-${idx}`}
                        className="hover:bg-gray-600 transition-colors duration-200"
                      >
                        <td className="py-1 px-2 border border-gray-600 text-center">{usage.userId}</td>
                        <td className="py-1 px-2 border border-gray-600">{usage.username}</td>
                        <td className="py-1 px-2 border border-gray-600">{usage.email}</td>
                        <td className="py-1 px-2 border border-gray-600">{usage.courseTitle} ({usage.courseId})</td>
                        <td className="py-1 px-2 border border-gray-600 text-center">{usage.discountAmount}</td>
                        <td className="py-1 px-2 border border-gray-600 text-center">{new Date(...usage.usedAt).toLocaleString("vi-VN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiscountUsageList;