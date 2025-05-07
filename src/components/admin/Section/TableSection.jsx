import Swal from "sweetalert2";
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
        text: "Trạng thái Section được giữ nguyên.",
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
              Section ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-white">
              Tên khóa học
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
          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <tr
                key={section.sectionId}
                className="hover:bg-gray-600 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {section.sectionId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {section.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {section.courseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {section.status ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {section.status ? (
                    <button
                      onClick={() => handleToggleStatus(section)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-none transition duration-150 ease-in-out"
                    >
                      Khóa
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(section)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-none transition duration-150 ease-in-out"
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
                colSpan="5"
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

export default TableSection;
