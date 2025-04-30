import { useState } from "react";

const PromotionUsageDetail = ({ promotion, onClose }) => {
  const [courseSearch, setCourseSearch] = useState("");
  const [usageSearch, setUsageSearch] = useState("");

  const toDate = arr =>
    new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);

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
    <div className="mt-8 border-t border-gray-600 pt-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Chi tiết: {promotion.promotionName}
        </h3>
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Đóng
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin chung */}
        <div>
          <h4 className="font-semibold mb-3">Thông tin Promotion</h4>
          <ul className="space-y-2">
            <li>Tên: {promotion.promotionName}</li>
            <li>Giảm: {promotion.percentage}%</li>
            <li>Max giảm: {promotion.maxPromotion ?? "-"}</li>
            <li>
              Thời gian:{" "}
              {toDate(promotion.startDate).toLocaleDateString("vi-VN")}{" "}
              → {toDate(promotion.endDate).toLocaleDateString("vi-VN")}
            </li>
            <li>Trạng thái: {promotion.status}</li>
            <li>Lượt dùng: {promotion.usageCount}</li>
            <li>Tổng giảm: {promotion.totalDiscountAmount}</li>
          </ul>
        </div>

        {/* Courses & Usages */}
        <div className="space-y-6">
          {/* Courses */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Khóa áp dụng</h4>
              <input
                type="text"
                placeholder="Tìm khóa..."
                className="p-1 rounded bg-gray-700"
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
              />
            </div>
            <ul className="list-disc ml-5 max-h-40 overflow-y-auto">
              {courses.length>0
                ? courses.map(c => (
                    <li key={c.courseId}>
                      {c.title} ({c.courseId})
                    </li>
                  ))
                : <li className="text-gray-400">Không có khóa nào.</li>}
            </ul>
          </div>

          {/* Usages */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Lịch sử sử dụng</h4>
              <input
                type="text"
                placeholder="Tìm user/course..."
                className="p-1 rounded bg-gray-700"
                value={usageSearch}
                onChange={e => setUsageSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto max-h-60">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="px-2 py-1">User</th>
                    <th className="px-2 py-1">Khóa</th>
                    <th className="px-2 py-1">Giảm</th>
                    <th className="px-2 py-1">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {usages.length>0 ? usages.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-600">
                      <td className="px-2 py-1">
                        {u.username} ({u.userId})
                      </td>
                      <td className="px-2 py-1">
                        {u.courseTitle} ({u.courseId})
                      </td>
                      <td className="px-2 py-1">{u.discountAmount}</td>
                      <td className="px-2 py-1">
                        {toDate(u.usedAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-400 py-2">
                        Không có bản ghi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionUsageDetail;
