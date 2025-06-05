import React, { useState, useMemo } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function TableLectureReport({ reports = [], triggerRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const [detailLoading, setDetailLoading] = useState(false);
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
        `${baseUrl}/api/admin/lectures/${r.lecture_id}/reports/approve`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
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
      await fetch(
        `${baseUrl}/api/admin/lectures/reports/${r.reportId}/reject`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
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
        `${baseUrl}/api/admin/lectures/detail/reports/${report.reportId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Lấy dữ liệu thất bại");
      const data = await res.json();

      // Format thời gian
      const reportTime = new Date(data.reportCreatedAt).toLocaleString(
        "vi-VN",
        { dateStyle: "short", timeStyle: "short" }
      );

      // Build HTML popup
      const contentHtml =
        data.content_type === "video"
          ? `<video src="${data.video_url}" controls class="w-full rounded-md mb-4"></video>`
          : data.document_url
          ? `<a href="${data.document_url}" target="_blank" class="text-indigo-600 underline mb-4 block">Xem tài liệu</a>`
          : "";

      const html = `
      <div class="space-y-6 text-gray-800">
        <!-- Header -->
        <div class="flex items-center space-x-3 border-b border-gray-200 pb-4">
          <svg xmlns="http://www.w3.org/2000/svg"
               class="w-6 h-6 text-indigo-600"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A6.992 6.992 0 0112 15a6.992 6.992 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <h2 class="text-2xl font-semibold">Chi tiết báo cáo Lecture</h2>
        </div>

        <!-- Thông tin nhanh -->
        <div class="space-y-2">
          <p><span class="font-medium text-gray-600">Người báo cáo:</span>
             <span class="text-gray-900">${data.firstNameUserReport} ${data.lastNameUserReport}</span>
             <span class="inline-block ml-2 px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">${data.reporterRole}</span>
          </p>
          <p><span class="font-medium text-gray-600">Thời gian:</span>
             <span class="text-gray-900">${reportTime}</span>
          </p>
          <p><span class="font-medium text-gray-600">Lecture ID:</span>
             <span class="text-gray-900">${data.lecture_id}</span>
          </p>
          <p><span class="font-medium text-gray-600">Tiêu đề:</span>
             <span class="text-gray-900">${data.title}</span>
          </p>
          <p><span class="font-medium text-gray-600">Loại nội dung:</span>
             <span class="text-gray-900 capitalize">${data.content_type}</span>
          </p>
        </div>

        <!-- Preview video/doc -->
        ${contentHtml}

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
      <div className="overflow-x-auto shadow-lg border border-gray-700 rounded-lg">
        <table className="min-w-full table-fixed divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {[
                { key: "seq", label: "STT", width: "w-12" },
                { key: "title", label: "Tiêu đề", width: "w-2/5" },
                { key: "content_type", label: "Loại nội dung", width: "w-1/5" },
                { key: "reporter", label: "Người báo cáo", width: "w-1/5" },
                { key: "reason", label: "Lý do", width: "w-1/3" },
                { key: "createdAt", label: "Ngày tạo", width: "w-32" },
                { key: "actions", label: "Thao tác", width: "w-32 text-right" },
              ].map((col) => (
                <th
                  key={col.key}
                  className={`${
                    col.width
                  } px-6 py-3 text-left text-xs font-semibold uppercase text-gray-300 whitespace-nowrap ${
                    col.key === "actions" ? "text-right" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {pageItems.map((r) => (
              <tr
                key={r.reportId}
                className={`transition-colors hover:bg-gray-700 ${
                  r._seq % 2 === 1 ? "bg-gray-800" : "bg-gray-750"
                }`}
              >
                <td
                  className="px-6 py-4 text-gray-200 text-sm truncate"
                  title={r._seq}
                >
                  {r._seq}
                </td>
                <td
                  className="px-6 py-4 text-gray-100 text-sm truncate"
                  title={r.title}
                >
                  {r.title}
                </td>
                <td
                  className="px-6 py-4 text-gray-200 text-sm truncate whitespace-nowrap capitalize"
                  title={r.content_type}
                >
                  {r.content_type}
                </td>
                <td
                  className="px-6 py-4 text-gray-200 text-sm truncate whitespace-nowrap"
                  title={`${r.firstName} ${r.lastName}`}
                >
                  {r.firstName} {r.lastName}
                </td>
                <td
                  className="px-6 py-4 text-gray-300 text-sm truncate"
                  title={r.reason}
                >
                  {r.reason}
                </td>
                <td
                  className="px-6 py-4 text-gray-300 text-sm truncate whitespace-nowrap"
                  title={new Date(r.createdAt).toLocaleDateString("vi-VN")}
                >
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-right flex justify-end space-x-2">
                  <button
                    onClick={() => handleView(r)}
                    disabled={detailLoading}
                    className="p-2 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-700 disabled:opacity-50 transition"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleApprove(r)}
                    disabled={isLoading}
                    className="p-2 bg-green-600 rounded-md text-white text-sm hover:bg-green-700 disabled:opacity-50 transition"
                    title="Phê duyệt"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(r)}
                    disabled={isLoading}
                    className="p-2 bg-red-600 rounded-md text-white text-sm hover:bg-red-700 disabled:opacity-50 transition"
                    title="Từ chối"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-gray-500 text-sm whitespace-nowrap"
                >
                  Không có báo cáo nào
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
