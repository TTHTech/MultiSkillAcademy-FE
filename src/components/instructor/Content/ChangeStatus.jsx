import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ChangeStatus = ({ title, courseId, status, triggerRefresh }) => {
  const { id } = useParams();
  const userId = Number(localStorage.getItem("userId"));
  const [instructor, setInstructor] = useState(null);
  const [setError] = useState(null);

  const getNextStatus = (currentStatus) => {
    const mapping = {
      Unsent: "Pending",
      Active: "Processing",
      Declined: "Pending",
      Processing: "Active",
      Inactive: "Pending",
      Pending: "Active",
    };
    return mapping[currentStatus] || null;
  };
  const statusColor = {
    Unsent: "text-gray-800",
    Pending: "text-gray-600",
    Active: "text-green-600",
    Processing: "text-yellow-600",
    Declined: "text-orange-600",
    Inactive: "text-red-600",
  };
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, please login first.");

        const response = await fetch(
          `${baseUrl}/api/instructor/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch instructor data");

        const data = await response.json();
        setInstructor(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInstructor();
  }, [userId]);
  const handleComposeEmail = async () => {
    const email = "tthoai2401.learn@gmail.com";
    const subject = `Xác nhận phục hồi khóa học bị khóa ${courseId}`;
    const body = `ĐƠN XIN XEM XÉT PHỤC HỒI HOẠT ĐỘNG CHO KHÓA HỌC\n
    THÔNG TIN KHÓA HỌC\n
    - ID KHÓA HỌC: ${courseId}\n
    - TÊN KHÓA HỌC: "${title.toUpperCase()}"\n
    - TÊN GIẢNG VIÊN: ${instructor.firstName.toUpperCase()} ${instructor.lastName.toUpperCase()}\n
    - Email: ${instructor.email} \n
    - SỐ ĐIỆN THOẠI: ${instructor.phoneNumber} \n
    LÝ DO:\n
    - \n
    - \n
    VUI LÒNG XỬ LÝ SỚM. XIN CHÂN THÀNH CẢM ƠN!`;
    const loginUrl = `https://accounts.google.com/AccountChooser?Email=${instructor.email}`;
    const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    const swalResult1 = await Swal.fire({
      title: "Chú ý",
      text: "Bạn có thể thực hiện việc gởi Email cho Admin để được duyệt sớm nhất.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (swalResult1.isDismissed) {
      return;
    }
    const swalResult = await Swal.fire({
      title: "Xác nhận đăng nhập",
      text: `Bạn đã đăng nhập email ? \nNên sử dụng email này "${instructor.email}" để được ưu tiên.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Tiếp tục",
      cancelButtonText: "Hủy",
    });

    if (swalResult.isDismissed) {
      return;
    }

    if (swalResult.isConfirmed) {
      window.open(composeUrl, "_blank");
    } else {
      window.open(loginUrl, "_blank");
      setTimeout(() => {
        window.open(composeUrl, "_blank");
      }, 3000);
    }
  };
  const statusMeaning = {
    unsent: "Khóa học vừa được tạo và chưa được gửi đi",
    pending: "Khóa học đang chờ 'Quản Trị Viên' phê duyệt",
    active: "Khóa học đang hoạt động, học viên có thể xem và đăng ký học",
    processing: "Khóa học đang được bảo trì",
    declined: "Khóa học đã bị từ chối, không được 'Quản Trị Viên' chấp nhận",
    inactive:
      "Khóa học không hoạt động, bị 'Quản Trị Viên' tạm dừng hoặc bị khóa",
  };
  const handleChangeStatus = async (event) => {
    event.stopPropagation();
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn đổi trạng thái khóa học không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    try {
      const response = await axios.put(
        `${baseUrl}/api/instructor/changeStatus/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data) {
        const swalResult = await Swal.fire({
          title: "Confirmation",
          text: "Chuyển đổi trạng thái khóa học thành công",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Yes",
        });
        if (swalResult) {
          triggerRefresh();
        }
      }
    } catch (error) {
      console.error("Error changing status:", error);
      alert("Failed to change course status");
    }
  };
  return (
    <div className="min-h-screen bg-white-100 p-6">
      <h1 className="text-2xl font-bold">Chuyển đổi trạng thái</h1>
      <p className="text-gray-500 text-sm italic">
        Chuyển đổi trạng thái khóa học để khóa học có trạng thái hoạt động phù
        hợp với mong muốn của bạn.
      </p>

      <div className="mt-6 w-full px-4">
        <div className="flex flex-wrap items-center justify-start space-x-4">
          <button
            disabled
            className={`flex-1 py-3 px-4 border rounded-lg text-2xl font-bold bg-white shadow ${statusColor[status]}`}
          >
            {status.toUpperCase()}
          </button>
          {status.toLowerCase() === "pending" ? (
            <button
              disabled
              className="flex-none bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow"
            >
              Đang chờ Quản trị viên duyệt
            </button>
          ) : getNextStatus(status) ? (
            <button
              onClick={async (event) => {
                if (status.toLowerCase() === "inactive") {
                  await handleChangeStatus(event);
                  await handleComposeEmail(event);
                } else {
                  await handleChangeStatus(event);
                }
              }}
              className="flex-none bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center shadow"
            >
              <span>Chuyển thành</span>
              <span className="ml-2"></span>
            </button>
          ) : (
            <button
              disabled
              className="flex-none bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow"
            >
              Không có thay đổi
            </button>
          )}

          <div
            className={`flex-1 py-3 px-4 border rounded-lg text-2xl font-bold text-center shadow ${
              getNextStatus(status)
                ? statusColor[getNextStatus(status)]
                : "text-gray-500"
            }`}
          >
            {getNextStatus(status) ? getNextStatus(status).toUpperCase() : "-"}
          </div>
        </div>

        <div className="w-full bg-gray-50 p-4 rounded shadow mt-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Mô tả trạng thái
          </h3>
          {getNextStatus(status) && (
            <p className="mt-2 text-gray-700">
              Hiện tại, khóa học đang ở trạng thái{" "}
              <span className={`font-bold ${statusColor[status]}`}>
                {status.toUpperCase()}
              </span>
              {statusMeaning[status]}. Sau khi chuyển đổi, trạng thái sẽ là{" "}
              <span
                className={`font-bold ${statusColor[getNextStatus(status)]}`}
              >
                {getNextStatus(status).toUpperCase()}
              </span>{" "}
              {getNextStatus(status).toUpperCase() === "PENDING"
                ? "(Khóa học sẽ được gửi để 'Quản Trị Viên' kiểm duyệt lại)"
                : getNextStatus(status).toUpperCase() === "PROCESSING"
                ? "(Khóa học sẽ được tạm dừng để cập nhật)"
                : getNextStatus(status).toUpperCase() === "ACTIVE"
                ? "(Khóa học sẽ hoạt động)"
                : ""}
              .
            </p>
          )}
        </div>
      </div>

      <h2 className="text-2x1 font-bold mt-4 mb-2">
        Bảng mô tả ý nghĩa các trạng thái
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Ý nghĩa
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                UNSENT
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                Khóa học vừa được tạo và chưa được gửi đi
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-600">
                PENDING
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                Khóa học đang chờ "Quản Trị Viên" phê duyệt
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                ACTIVE
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                Khóa học đang hoạt động, học viên có thể xem và đăng ký học
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-yellow-600">
                PROCESSING
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                Khóa học đang được bảo trì
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-orange-600">
                DECLINED
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                Khóa học đã bị từ chối, không được "Quản Trị Viên" chấp nhận
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-red-600">
                INACTIVE
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                Khóa học không hoạt động, bị "Quản Trị Viên" tạm dừng hoặc bị
                khóa
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="text-2x1 font-bold mt-4 mb-2">
        Bảng mô tả cách thức chuyển đổi trạng thái hoạt dộng của khóa học
      </h2>
      <div className="bg-white shadow rounded p-4">
        <ul className="divide-y divide-gray-200">
          <li className="py-4 flex items-center">
            <span className="w-32 font-semibold uppercase">UNSENT</span>
            <span className="mx-2">→</span>
            <span className="text-gray-600 font-semibold uppercase">
              PENDING
            </span>
            <span className="ml-4 text-gray-600">
              (Khóa học mới được gởi lên để "Quản Trị Viên" kiểm duyệt)
            </span>
          </li>
          <li className="py-4 flex items-center">
            <span className="w-32 font-semibold text-green-600 uppercase">
              ACTIVE
            </span>
            <span className="mx-2">→</span>
            <span className="text-yellow-600 font-semibold uppercase">
              PROCESSING
            </span>
            <span className="ml-4 text-gray-600">
              (Khóa học được tạm dừng để cập nhật)
            </span>
          </li>
          <li className="py-4 flex items-center">
            <span className="w-32 font-semibold text-orange-600 uppercase">
              DECLINED
            </span>
            <span className="mx-2">→</span>
            <span className="text-gray-600 font-semibold uppercase">
              PENDING
            </span>
            <span className="ml-4 text-gray-600">
              (Khóa học sau khi bị kiểm duyệt không đạt được gởi lên lại để
              "Quản Trị Viên" kiểm duyệt lại)
            </span>
          </li>
          <li className="py-4 flex items-center">
            <span className="w-32 font-semibold text-yellow-600 uppercase">
              PROCESSING
            </span>
            <span className="mx-2">→</span>
            <span className="text-green-600 font-semibold uppercase">
              ACTIVE
            </span>
            <span className="ml-4 text-gray-600">
              (Khóa học sau khi được cập nhật thì được đưa vào hoạt động lại)
            </span>
          </li>
          <li className="py-4 flex items-center">
            <span className="w-32 font-semibold text-red-600 uppercase">
              INACTIVE
            </span>
            <span className="mx-2">→</span>
            <span className="text-gray-600 font-semibold uppercase">
              PENDING
            </span>
            <span className="ml-4 text-gray-600">
              (Khóa học bị khóa đưuojc gởi lên để "Quản Trị Viên" kiểm tra lại)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChangeStatus;
