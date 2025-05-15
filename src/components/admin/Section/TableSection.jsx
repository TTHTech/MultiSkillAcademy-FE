import Swal from "sweetalert2";
import { FaLock, FaLockOpen, FaEye } from "react-icons/fa";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const TableSection = ({ sections, triggerRefresh }) => {
  const handleToggleStatus = async (section) => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "Bạn có chắc?",
      text: `Bạn có chắc chắn muốn thay đổi trạng thái của Chương "${section.title}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, thay đổi nó!",
      cancelButtonText: "Không, hủy bỏ",
      background: "#2d3748",
      color: "#fff",
      confirmButtonColor: "#3182ce",
      cancelButtonColor: "#e53e3e",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${baseUrl}/api/admin/section/${section.sectionId}/toggle-status`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Lỗi khi thay đổi trạng thái section");
        }
        Swal.fire({
          title: "Thành công!",
          text: "Trạng thái đã được thay đổi.",
          icon: "success",
          background: "#2d3748",
          color: "#fff",
          confirmButtonColor: "#3182ce",
        });
        triggerRefresh();
      } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái:", error);
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi thay đổi trạng thái.",
          icon: "error",
          background: "#2d3748",
          color: "#fff",
          confirmButtonColor: "#3182ce",
        });
      }
    } else {
      Swal.fire({
        title: "Đã hủy",
        text: "Trạng thái Section được giữ nguyên.",
        icon: "info",
        background: "#2d3748",
        color: "#fff",
        confirmButtonColor: "#3182ce",
      });
    }
  };

  return (
    <div className="overflow-hidden shadow-xl rounded-xl border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Section ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Tiêu đề
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Tên khóa học
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <tr
                key={section.sectionId}
                className="hover:bg-gray-800 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                  #{section.sectionId}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-white">
                  {section.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {section.courseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {section.status ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                      <span className="w-2 h-2 mr-1.5 rounded-full bg-green-400"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
                      <span className="w-2 h-2 mr-1.5 rounded-full bg-red-400"></span>
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(section)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center transition-colors duration-200 ${
                        section.status
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {section.status ? (
                        <>
                          <FaLock className="mr-1.5" /> Khóa
                        </>
                      ) : (
                        <>
                          <FaLockOpen className="mr-1.5" /> Mở khóa
                        </>
                      )}
                    </button>
                    <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center transition-colors duration-200">
                      <FaEye className="mr-1.5" /> Xem
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-10 text-center text-sm text-gray-400 bg-gray-900"
              >
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-700 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-gray-400">Không có dữ liệu</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Không tìm thấy dữ liệu phù hợp với bộ lọc hiện tại
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableSection;