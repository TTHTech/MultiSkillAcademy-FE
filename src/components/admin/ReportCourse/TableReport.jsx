// src/components/admin/ReportCourse/TableCourseReport.tsx
import { useState, useMemo } from "react";
import {
  Eye,
  XCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function TableCourseReport({ reports = [], triggerRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [detailLoading, setDetailLoading] = useState(false);
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return reports.slice(start, start + itemsPerPage).map((r, idx) => ({
      ...r,
      _seq: start + idx + 1,
    }));
  }, [reports, currentPage]);

  const handleApprove = async (r) => {
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
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${baseUrl}/api/admin/courses/${r.courseId}/reports/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Đã duyệt!", "", "success");
      triggerRefresh();
    } catch {
      Swal.fire("Lỗi khi duyệt báo cáo", "", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (r) => {
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
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${baseUrl}/api/admin/courses/reports/${r.reportId}/reject`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Đã từ chối!", "", "success");
      triggerRefresh();
    } catch {
      Swal.fire("Lỗi khi từ chối báo cáo", "", "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleView = async (report) => {
    const token = localStorage.getItem("token");
    setDetailLoading(true);

    try {
      const res = await fetch(
        `${baseUrl}/api/admin/courses/detail/reports/${report.reportId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Lấy dữ liệu thất bại");
      const data = await res.json();

      // Format ngày
      const reportTime = new Date(data.reportCreatedAt).toLocaleString(
        "vi-VN",
        {
          dateStyle: "short",
          timeStyle: "short",
        }
      );

      // Build HTML chi tiết
      const html = `
      <div class="space-y-6 text-gray-800">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A6.992 6.992 0 0112 15a6.992 6.992 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 class="text-2xl font-semibold">Chi tiết báo cáo khóa học</h2>
        </div>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4">
          <div class="col-span-2 flex items-center">
            <span class="w-32 font-medium text-gray-600">Người báo cáo:</span>
            <span class="text-gray-900 mr-2">${data.firstNameUserReport} ${data.lastNameUserReport}</span>
            <span class="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
              ${data.reporterRole}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600">Ngày báo cáo</p>
            <p class="mt-1 text-gray-900">${reportTime}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Khóa học</p>
            <p class="mt-1 text-gray-900">${data.courseId} – ${data.categoriesName}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Giảng viên</p>
            <p class="mt-1 text-gray-900">${data.instructorFirstName} ${data.instructorLastName}</p>
          </div>
        </div>
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
              <th className="px-6 py-4 whitespace-nowrap text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Ảnh khóa học
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Người báo cáo
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Lý do
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {pageItems.length > 0 ? (
              pageItems.map((r) => (
                <tr
                  key={r.reportId}
                  className="even:bg-gray-800 odd:bg-gray-750 hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-3 text-gray-200">{r._seq}</td>
                  <td className="px-6 py-3">
                    <img
                      src={r.imageURL}
                      alt={r.title}
                      className="h-12 w-12 rounded-md object-cover border border-gray-700"
                    />
                  </td>
                  <td className="px-6 py-3 text-gray-100 font-medium">
                    {r.title}
                  </td>
                  <td className="px-6 py-3 text-gray-200">
                    {r.firstName} {r.lastName}
                  </td>
                  <td
                    className="px-6 py-3 text-gray-300 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis"
                    title={r.reason}
                  >
                    {r.reason}
                  </td>
                  <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="px-6 py-3 text-right space-x-2 flex justify-end">
                    <button
                      onClick={() => handleView(r)}
                      disabled={detailLoading}
                      className="p-2 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleApprove(r)}
                      disabled={isLoading}
                      className="p-2 bg-green-600 rounded-md text-white text-sm hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(r)}
                      disabled={isLoading}
                      className="p-2 bg-red-600 rounded-md text-white text-sm hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Không có báo cáo nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {reports.length > itemsPerPage && (
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <span className="text-sm text-gray-400">
            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> -{" "}
            <strong>
              {Math.min(currentPage * itemsPerPage, reports.length)}
            </strong>{" "}
            trên <strong>{reports.length}</strong>
          </span>
          <div className="inline-flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-900 border border-gray-700 rounded-l-md hover:bg-gray-700 disabled:opacity-50 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 border-t border-b border-gray-700 ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-gray-900 text-gray-300 hover:bg-gray-700"
                } transition`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-900 border border-gray-700 rounded-r-md hover:bg-gray-700 disabled:opacity-50 transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
