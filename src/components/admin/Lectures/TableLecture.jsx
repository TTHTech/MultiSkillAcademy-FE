import Swal from "sweetalert2";

const TableLecture = ({ lectures, triggerRefresh }) => {
  const handleToggleStatus = async (lecture) => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "Bạn có chắc?",
      text: `Bạn có chắc chắn muốn thay đổi trạng thái của Lecture "${lecture.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, thay đổi nó!",
      cancelButtonText: "Không, hủy bỏ",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/lectures/${lecture.lectureId}/toggle-status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Lỗi khi thay đổi trạng thái lecture");
        }
        Swal.fire({
          title: "Thành công!",
          text: "Trạng thái đã được thay đổi.",
          icon: "success",
        });
        triggerRefresh();
      } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái:", error);
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi thay đổi trạng thái.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Đã hủy",
        text: "Trạng thái Lecture được giữ nguyên.",
        icon: "info",
      });
    }
  };
  const handleViewResource = (lecture) => {
    if (lecture.contentType === "video" && lecture.videoUrl) {
      window.open(lecture.videoUrl, "_blank");
    } else if (lecture.contentType === "pdf" && lecture.documentUrl) {
      window.open(lecture.documentUrl, "_blank");
    } else {
      Swal.fire({
        title: "Không có tài liệu",
        text: "Không tìm thấy đường dẫn tài liệu tương ứng.",
        icon: "info",
      });
    }
  };
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full divide-y divide-gray-600">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Lecture ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Tên section
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Tên khóa học
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Xem Tài Liệu
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {lectures && lectures.length > 0 ? (
            lectures.map((lecture) => (
              <tr
                key={lecture.lectureId}
                className="hover:bg-gray-600 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {lecture.lectureId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {lecture.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {lecture.sectionName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {lecture.courseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lecture.contentType === "video" && lecture.videoUrl ? (
                    <button
                      onClick={() => handleViewResource(lecture)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-150 ease-in-out"
                    >
                      Xem Video
                    </button>
                  ) : lecture.contentType === "pdf" && lecture.documentUrl ? (
                    <button
                      onClick={() => handleViewResource(lecture)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-150 ease-in-out"
                    >
                      Xem PDF
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Không có dữ liệu
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {lecture.status ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {lecture.status ? (
                    <button
                      onClick={() => handleToggleStatus(lecture)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition duration-150 ease-in-out"
                    >
                      Khóa
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(lecture)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition duration-150 ease-in-out"
                    >
                      Mở khóa
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="px-6 py-4 text-center text-sm text-white"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableLecture;
