import { useState } from "react";
import Swal from "sweetalert2";
import { Star, StarHalf } from "lucide-react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function TableReport({
  reports,
  onDeleteReport,
  triggerRefresh,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [detailLoading, setDetailLoading] = useState(false);
  const [reportDetail, setReportDetail] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleApprove = async (report) => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "Xác nhận phê duyệt",
      html: `Bạn có chắc chắn muốn <b>phê duyệt</b> báo cáo này?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Phê duyệt",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        `${baseUrl}/api/admin/reviews/${report.review_id}/reports/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Phê duyệt thất bại");

      Swal.fire(
        "Đã phê duyệt!",
        "Review và các báo cáo liên quan đã được xoá.",
        "success"
      );
      triggerRefresh();
    } catch (err) {
      Swal.fire("Lỗi!", err.message || "Không thể phê duyệt.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleReject = async (report) => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "Xác nhận từ chối",
      html: `Bạn có chắc chắn muốn <b>từ chối</b> báo cáo?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      setIsLoading(true);
      const res = await fetch(
        `${baseUrl}/api/admin/reviews/reports/${report.reportId}/reject`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Từ chối thất bại");
  
      Swal.fire("Đã từ chối!", "Báo cáo đã được xóa.", "success");
      onDeleteReport(report.reportId);
    } catch (err) {
      Swal.fire("Lỗi!", err.message || "Không thể từ chối báo cáo.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const renderRating = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    const empty = 5 - Math.ceil(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(full)].map((_, i) => (
          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
        ))}
        {half && (
          <StarHalf size={16} className="text-yellow-400 fill-yellow-400" />
        )}
        {[...Array(empty)].map((_, i) => (
          <Star key={i + full} size={16} className="text-gray-400" />
        ))}
      </div>
    );
  };

  const sorted = [...reports].sort((a, b) => {
    let cmp = 0;
    if (sortField === "rating") cmp = a.rating - b.rating;
    else if (sortField === "createdAt") cmp = a.createdAt - b.createdAt;
    else cmp = String(a[sortField] || "").localeCompare(b[sortField] || "");
    return sortDirection === "asc" ? cmp : -cmp;
  });
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = sorted.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const roleMap = {
    STUDENT: "Học viên",
    INSTRUCTOR: "Giảng viên",
  };

  const handleView = async (report) => {
    const token = localStorage.getItem("token");
    setDetailLoading(true);

    try {
      const res = await fetch(
        `${baseUrl}/api/admin/reviews/detail/reports/${report.reportId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Lấy dữ liệu thất bại");
      const data = await res.json();

      // Format thời gian
      const reportTime = new Date(data.reportCreatedAt).toLocaleString(
        "vi-VN",
        { dateStyle: "short", timeStyle: "short" }
      );
      // Build HTML cho star rating
      const fullStars = "★".repeat(data.rating);
      const emptyStars = "☆".repeat(5 - data.rating);
      const starsHtml = `
        <span class="text-yellow-400 text-lg">${fullStars}</span>
        <span class="text-gray-300 text-lg ml-1">${emptyStars}</span>
      `;

      // Nội dung chính
      const html = `
        <div class="space-y-6 text-gray-800">
          <!-- Header with icon + title -->
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A6.992 6.992 0 0112 15a6.992 6.992 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 class="text-2xl font-semibold">Chi tiết báo cáo</h2>
          </div>
  
          <!-- Thông tin nhanh -->
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div class="col-span-2 flex flex-nowrap items-center">
              <span class="w-32 font-medium text-gray-600">Người báo cáo:</span>
              <span class="whitespace-nowrap text-gray-900 mr-2">
                ${data.firstNameUserReport} ${data.lastNameUserReport}
              </span>
              <span class="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                ${data.reporterRole}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Thời gian</p>
              <p class="mt-1 text-gray-900">${reportTime}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Khóa học</p>
              <p class="mt-1 text-gray-900">${data.courseId} – ${data.title}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Reviewer</p>
              <p class="mt-1 text-gray-900">${data.firstNameUserReview} ${data.lastNameUserReview}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Đánh giá</p>
              <p class="mt-1">${starsHtml}</p>
            </div>
          </div>
  
          <!-- Nội dung review -->
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-1">Nội dung review</p>
            <div class="p-4 bg-gray-50 rounded-lg text-gray-800">${data.comment}</div>
          </div>
  
          <!-- Lý do báo cáo -->
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-1">Lý do báo cáo</p>
            <div class="p-4 bg-gray-50 rounded-lg text-gray-800">${data.reason}</div>
          </div>
        </div>
      `;

      await Swal.fire({
        html,
        width: 700,
        background: "#FFFFFF",
        showCloseButton: true,
        confirmButtonText: "Đóng",
        confirmButtonColor: "#4F46E5",
        customClass: {
          popup: "rounded-xl shadow-2xl overflow-hidden",
          htmlContainer: "p-6",
          confirmButton:
            "mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md",
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể tải chi tiết.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th
                onClick={() => handleSort("reportId")}
                className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-200 uppercase tracking-wider cursor-pointer"
              >
                ID
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Người báo cáo
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Role
              </th>
              <th
                onClick={() => handleSort("rating")}
                className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-200 uppercase tracking-wider cursor-pointer"
              >
                Điểm
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Nội dung review
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Lý do
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {pageItems.length > 0 ? (
              pageItems.map((r, i) => (
                <tr
                  key={r.reportId}
                  className={`${
                    i % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                  } hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-gray-200">
                    {i+1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap flex items-center">
                    <div className="h-8 w-8 mr-3 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {r.firstName.charAt(0)}
                    </div>
                    <span className="text-sm text-white">
                      {r.firstName} {r.lastName}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                    {roleMap[r.reporterRole] || r.reporterRole}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {renderRating(r.rating)}
                  </td>
                  <td
                    title={r.comment}
                    className="px-4 py-3 text-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-xs"
                  >
                    {r.comment}
                  </td>
                  <td
                    title={r.reason}
                    className="px-4 py-3 text-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-xs"
                  >
                    {r.reason}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(r)}
                        disabled={detailLoading}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full transition duration-150 shadow-sm focus:outline-none disabled:opacity-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleApprove(r)}
                        disabled={isLoading}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-full transition duration-150 shadow-sm focus:outline-none disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleReject(r)}
                        disabled={isLoading}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full transition duration-150 shadow-sm focus:outline-none disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Chưa có báo cáo nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {reports.length > itemsPerPage && (
        <div className="bg-gray-800 p-4 flex items-center justify-between border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Hiển thị {start + 1} -{" "}
            {Math.min(start + itemsPerPage, reports.length)} trên{" "}
            {reports.length}
          </div>
          <nav className="inline-flex -space-x-px">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-gray-900 border border-gray-700 text-gray-300 rounded-l-md disabled:opacity-50"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 border ${
                  currentPage === idx + 1
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-gray-900 border border-gray-700 text-gray-300 rounded-r-md disabled:opacity-50"
            >
              ›
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
