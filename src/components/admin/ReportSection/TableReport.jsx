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

export default function TableSectionReport({ reports = [], triggerRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
        `${baseUrl}/api/admin/section/${r.section_id}/reports/approve`,
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
      await fetch(`${baseUrl}/api/admin/section/reports/${r.reportId}/reject`, {
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
        `${baseUrl}/api/admin/section/detail/reports/${report.reportId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Lấy dữ liệu thất bại");
      const data = await res.json();
      const reportTime = new Date(data.reportCreatedAt).toLocaleString(
        "vi-VN",
        { dateStyle: "short", timeStyle: "short" }
      );

      const priceFormatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(data.coursePrice);

      const html = `
          <div class="space-y-8 text-gray-800">
          <!-- Header -->
          <div class="flex items-center space-x-3 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg"
                class="w-7 h-7 text-indigo-600"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5.121 17.804A6.992 6.992 0 0112 15a6.992 6.992 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <h2 class="text-3xl font-bold">Chi tiết báo cáo</h2>
          </div>

          <!-- Image & Course Info -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8">
            <img src="${data.courseImageURL}" alt="Course image"
                class="w-32 h-32 object-cover rounded-xl shadow-md mb-4 sm:mb-0"/>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="font-medium text-gray-600 w-32">Course ID:</span>
                <span class="text-gray-900 ml-2">${data.courseId}</span>
              </div>
              <div class="flex items-center">
                <span class="font-medium text-gray-600 w-32">Khóa học:</span>
                <span class="text-gray-900 ml-2">${data.categoriesName}</span>
              </div>
              <div class="flex items-center">
                <span class="font-medium text-gray-600 w-32">Trạng thái:</span>
                <span class="text-gray-900 ml-2">${data.courseStatus}</span>
              </div>
            </div>
          </div>

          <!-- Quick Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="flex items-center">
              <span class="w-32 font-medium text-gray-600">Người báo cáo:</span>
              <span class="text-gray-900 ml-2">${data.firstNameUserReport} ${data.lastNameUserReport}</span>
            </div>
            <div class="flex items-center">
              <span class="w-32 font-medium text-gray-600">Thời gian:</span>
              <span class="text-gray-900 ml-2">${reportTime}</span>
            </div>
            <div class="flex items-center">
              <span class="w-32 font-medium text-gray-600">Giá:</span>
              <span class="text-gray-900 ml-2">${priceFormatted}</span>
            </div>
            <div class="flex items-center">
              <span class="w-32 font-medium text-gray-600">Section ID:</span>
              <span class="text-gray-900 ml-2">${data.section_id}</span>
            </div>
            <div class="flex items-center sm:col-span-2">
              <span class="w-32 font-medium text-gray-600">Tiêu đề Section:</span>
              <span class="text-gray-900 ml-2">${data.sectionTitle}</span>
            </div>
          </div>

          <!-- Lý do báo cáo -->
          <div class="space-y-2">
            <p class="text-lg font-semibold text-gray-700">Lý do báo cáo</p>
            <div class="p-4 rounded-lg text-gray-800">
              ${data.reason}
            </div>
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
        text: error.message || "Không thể tải chi tiết Section.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto shadow-lg border border-gray-700 rounded-xl">
        <table className="table-auto min-w-min divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              {[
                { key: "seq", label: "STT", width: "w-10" },
                { key: "courseTitle", label: "Khóa học", width: "w-24" },
                { key: "sectionTitle", label: "Chương học", width: "w-24" },
                { key: "reporter", label: "Người", width: "w-20" },
                { key: "reason", label: "Lý do", width: "w-32" },
                { key: "createdAt", label: "Ngày", width: "w-20" },
                {
                  key: "actions",
                  label: "Hành động",
                  width: "w-16 text-right",
                },
              ].map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold uppercase text-gray-400 ${col.width}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {pageItems.length ? (
              pageItems.map((r, idx) => (
                <tr
                  key={r.reportId}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-850" : "bg-gray-800"
                  } hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-4 py-3 text-sm text-gray-200 truncate">
                    {r._seq}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-medium text-gray-100 truncate"
                    title={r.courseTitle}
                  >
                    {r.courseTitle}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-medium text-gray-100 truncate"
                    title={r.sectionTitle}
                  >
                    {r.sectionTitle}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-200 truncate"
                    title={`${r.firstName} ${r.lastName}`}
                  >
                    {r.firstName} {r.lastName}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-300 max-w-[30ch] truncate"
                    title={r.reason}
                  >
                    {r.reason}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 truncate">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-sm flex justify-end space-x-2">
                    <button
                      onClick={() => handleView(r)}
                      disabled={detailLoading}
                      className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50 transition"
                      title="Xem"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(r)}
                      disabled={isLoading}
                      className="p-2 bg-green-600 rounded-lg text-white hover:bg-green-700 disabled:opacity-50 transition"
                      title="Phê duyệt"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(r)}
                      disabled={isLoading}
                      className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-700 disabled:opacity-50 transition"
                      title="Từ chối"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  Không có báo cáo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {reports.length > itemsPerPage && (
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <span className="text-sm text-gray-400">
            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> –{" "}
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
