import { useState } from "react";

const PromotionUsageDetail = ({ promotion, onClose }) => {
  const [courseSearch, setCourseSearch] = useState("");
  const [usageSearch, setUsageSearch] = useState("");

  const toDate = arr =>
    new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);

  const formatCurrency = amount =>
    amount != null
      ? `${new Intl.NumberFormat('vi-VN').format(amount)} VND`
      : '-';

  // lọc courses, usages
  const courses = (promotion.appliedCourses || []).filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.courseId.toLowerCase().includes(courseSearch.toLowerCase())
  );
  const usages = (promotion.userPromotionUsages || []).filter(u =>
    u.username.toLowerCase().includes(usageSearch.toLowerCase()) ||
    u.courseTitle.toLowerCase().includes(usageSearch.toLowerCase())
  );

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Chi tiết: {promotion.promotionName}</h3>
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          Đóng
        </button>
      </div>

      {/* Top section: details and categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Chi tiết bên trái */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Thông tin Promotion</h4>
          <ul className="space-y-2">
            <li><span className="font-medium">Tên:</span> {promotion.promotionName}</li>
            <li><span className="font-medium">Giảm:</span> {promotion.percentage}%</li>
            <li><span className="font-medium">Max giảm:</span> {formatCurrency(promotion.maxPromotion)}</li>
            <li><span className="font-medium">Thời gian:</span> {' '}
              {toDate(promotion.startDate).toLocaleDateString('vi-VN')} ↔ {toDate(promotion.endDate).toLocaleDateString('vi-VN')}
            </li>
            <li><span className="font-medium">Trạng thái:</span> {promotion.status}</li>
            <li><span className="font-medium">Lượt dùng:</span> {promotion.usageCount}</li>
            <li><span className="font-medium">Tổng giảm:</span> {formatCurrency(promotion.totalDiscountAmount)}</li>
          </ul>
        </div>

        {/* Categories bên phải */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Khóa áp dụng</h4>
            <input
              type="text"
              placeholder="Tìm khóa..."
              className="p-2 rounded-md bg-gray-600 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={courseSearch}
              onChange={e => setCourseSearch(e.target.value)}
            />
          </div>
          <ul className="list-disc ml-5 max-h-64 overflow-y-auto">
            {courses.length > 0 ? (
              courses.map(c => (
                <li key={c.courseId} className="py-1">
                  {c.title} <span className="text-sm text-gray-300">({c.courseId})</span>
                </li>
              ))
            ) : (
              <li className="text-gray-400">Không có khóa nào.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Lịch sử sử dụng toàn chiều rộng */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Lịch sử sử dụng</h4>
          <input
            type="text"
            placeholder="Tìm user/course..."
            className="p-2 rounded-md bg-gray-600 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={usageSearch}
            onChange={e => setUsageSearch(e.target.value)}
          />
        </div>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Khóa</th>
                <th className="px-3 py-2">Giảm</th>
                <th className="px-3 py-2">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {usages.length > 0 ? (
                usages.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-600">
                    <td className="px-3 py-2">
                      {u.username} <span className="text-gray-300 text-sm">(UserId {u.userId})</span>
                    </td>
                    <td className="px-3 py-2">
                      {u.courseTitle} <span className="text-gray-300 text-sm">({u.courseId})</span>
                    </td>
                    <td className="px-3 py-2">{formatCurrency(u.discountAmount)}</td>
                    <td className="px-3 py-2">{toDate(u.usedAt).toLocaleString('vi-VN')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-4">
                    Không có bản ghi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PromotionUsageDetail;