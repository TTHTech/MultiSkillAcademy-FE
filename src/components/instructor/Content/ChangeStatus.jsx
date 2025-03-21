import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const ChangeStatus = () => {
  const { id } = useParams();
  //   const [loading, setLoading] = useState(true);
  //   if (loading) {
  //     return (
  //       <div className="flex justify-center items-center h-screen">
  //         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-white-100 p-6">
      <h1 className="text-2xl font-bold">Change Status</h1>
      <p className="text-gray-500 text-sm italic">
        Chuyển đổi trạng thái khóa học để khóa học có trạng thái hoạt động phù
        hợp với mong muốn của bạn.
      </p>
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
              (Khóa học sau khi bị kiểm duyệt không đạt được gởi lên lại để "Quản Trị Viên" kiểm duyệt lại)
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
