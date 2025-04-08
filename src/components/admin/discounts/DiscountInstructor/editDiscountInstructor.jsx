import { useEffect, useState } from "react";
import axios from "axios";
import TableCategoryAndCourses from "./tableCategoryAndCoursesInstructor";
import Swal from "sweetalert2";
import DiscountCreator from "../InforUserCreateDiscount";
const EditDiscount = ({ discountId, onCancel, triggerRefresh }) => {
  const [discountData, setDiscountData] = useState({
    createdBy: 1,
    name: "",
    code: "",
    description: "",
    eligibleUsers: "ALL_USERS",
    discountType: "PERCENTAGE",
    value: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    status: "",
    applicableCategories: [],
    applicableCourses: [],
  });
  const statusLabelMap = {
    ACTIVE: "Đang hoạt động",
    INACTIVE: "Không hoạt động",
    PENDING: "Chờ xét duyệt",
    DECLINED: "Bị từ chối",
  };

  const [declinedReason, setDeclinedReason] = useState("");
  const [showDeclinedInput, setShowDeclinedInput] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchDiscountData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/admin/discounts/${discountId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDiscountData(response.data);
      } catch (error) {
        console.error("Error fetching discount data", error);
      }
    };

    if (discountId) {
      fetchDiscountData();
    }
  }, [discountId]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "discountType") {
      setDiscountData({
        ...discountData,
        discountType: value,
        maxDiscount: value === "PERCENTAGE" ? discountData.maxDiscount : null,
      });
    } else {
      setDiscountData({ ...discountData, [name]: value });
    }
  };
  const getDateTimeLocalValue = (dateValue) => {
    if (!dateValue) return "";
    if (Array.isArray(dateValue)) {
      return new Date(...dateValue).toISOString().slice(0, 16);
    }
    return dateValue;
  };
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const confirmResult = await Swal.fire({
        title: "Bạn có chắc muốn xóa discount này không?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có, xóa ngay!",
        cancelButtonText: "Hủy",
      });

      if (confirmResult.isConfirmed) {
        await axios
          .delete(`http://localhost:8080/api/admin/discounts/${discountId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            Swal.fire("Đã xóa", "Discount đã được xóa thành công.", "success");
            triggerRefresh();
            onCancel();
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              Swal.fire("Không thể xóa", error.response.data, "warning");
            } else {
              Swal.fire("Lỗi", "Có lỗi xảy ra khi xóa discount.", "error");
            }
          });
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi xóa discount.", "error");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (
      !discountData.name ||
      !discountData.code ||
      !discountData.startDate ||
      !discountData.endDate ||
      !discountData.value ||
      !discountData.usageLimit ||
      discountData.usageLimit < 0 ||
      discountData.value < 0 ||
      (discountData.discountType === "PERCENTAGE" &&
        (!discountData.maxDiscount ||
          discountData.maxDiscount < 0 ||
          discountData.value < 0 ||
          discountData.value > 100)) ||
      discountData.applicableCourses.length === 0
    ) {
      Swal.fire(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin, chọn ít nhất 1 khóa học và đảm bảo giá trị discount hợp lệ",
        "error"
      );
      setLoading(false);
      return;
    }
    const startDate = new Date(discountData.startDate);
    const endDate = new Date(discountData.endDate);
    const now = new Date();

    if (startDate >= endDate) {
      Swal.fire("Lỗi", "Start Date phải sớm hơn End Date", "error");
      setLoading(false);
      return;
    }

    if (endDate < now) {
      Swal.fire(
        "Lỗi",
        "End Date không thể nhỏ hơn thời điểm hiện tại",
        "error"
      );
      setLoading(false);
      return;
    }
    const confirmResult = await Swal.fire({
      title: "Bạn có muốn lưu thay đổi Discount?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });

    if (!confirmResult.isConfirmed) {
      setLoading(false);
      return;
    }

    const userId = Number(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");

    const payload = {
      createdBy: userId,
      name: discountData.name,
      code: discountData.code,
      description: discountData.description,
      eligibleUsers: discountData.eligibleUsers,
      discountType: discountData.discountType,
      value: parseFloat(discountData.value),
      maxDiscount:
        discountData.discountType === "PERCENTAGE"
          ? parseFloat(discountData.maxDiscount)
          : null,
      startDate: discountData.startDate,
      endDate: discountData.endDate,
      usageLimit: parseInt(discountData.usageLimit, 10),
      status: discountData.status,
      applicableCategories: discountData.applicableCategories,
      applicableCourses: discountData.applicableCourses,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/admin/discounts/${discountId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Thành công", "Discount đã được lưu thành công!", "success");
      triggerRefresh();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        Swal.fire("Lỗi", err.response.data, "error");
      } else {
        Swal.fire(
          "Lỗi",
          "Có lỗi xảy ra khi lưu discount: " + err.message,
          "error"
        );
      }
    }
    setLoading(false);
  };
  const handleChangeStatus = async (newStatus) => {
    let reason = "";
    if (newStatus === "DECLINED") {
      if (!declinedReason.trim()) {
        alert("Vui lòng nhập lý do từ chối!");
        return;
      }
      reason = declinedReason;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/discounts/${discountId}/status`,
        {
          status: newStatus,
          declinedReason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data);
      triggerRefresh();
      setDeclinedReason("");
      setShowDeclinedInput(false);
      onCancel();
    } catch (error) {
      alert(error.response?.data || "Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };
  return (
    <div className="overflow-x-auto p-6">
      <button
        onClick={onCancel}
        className="mb-4 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-200"
      >
        &larr; Quay lại danh sách Discount
      </button>
      <div className="flex items-start justify-between mb-4">
        <div className="w-1/2">
          <h2 className="text-3xl font-bold text-white mb-2">
            View User Create Discount:
          </h2>
          <DiscountCreator discountId={discountId} />
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-2">
              Trạng thái hiện tại:{" "}
              {statusLabelMap[discountData.status] || "Không xác định"}
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {discountData.status === "ACTIVE" && (
                <button
                  onClick={() => handleChangeStatus("INACTIVE")}
                  className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-white text-sm px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Dừng hoạt động
                </button>
              )}
              {discountData.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleChangeStatus("ACTIVE")}
                    className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white text-sm px-4 py-2 rounded-lg shadow-md"
                  >
                    Cho phép hoạt động
                  </button>
                  <button
                    onClick={() => setShowDeclinedInput(true)}
                    className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-white text-sm px-4 py-2 rounded-lg shadow-md"
                  >
                    Từ chối hoạt động
                  </button>
                </>
              )}
              {discountData.status === "INACTIVE" && (
                <button
                  onClick={() => handleChangeStatus("ACTIVE")}
                  className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white text-sm px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Cho phép hoạt động
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeclinedInput && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-white text-xl font-semibold mb-4">
              Nhập lý do từ chối
            </h3>
            <input
              type="text"
              placeholder="Nhập lý do từ chối"
              value={declinedReason}
              onChange={(e) => setDeclinedReason(e.target.value)}
              className="border border-gray-600 bg-gray-700 text-white text-sm p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeclinedInput(false)}
                className="bg-gray-600 hover:bg-gray-500 transition-all duration-200 text-white text-sm px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={() => handleChangeStatus("DECLINED")}
                className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-white text-sm px-4 py-2 rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-white mb-4 mt-6">
        View Discount:
      </h2>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Tên Discount:</label>
              <input
                type="text"
                name="name"
                value={discountData.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Mã Code:</label>
              <input
                type="text"
                name="code"
                value={discountData.code}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Mô tả:</label>
              <textarea
                name="description"
                value={discountData.description}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                rows="3"
                disabled
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Dạng giảm giá:</label>
              <select
                name="discountType"
                value={discountData.discountType}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                disabled
              >
                <option value="PERCENTAGE">Giảm theo phần trăm</option>
                <option value="FIXED_AMOUNT">Giảm theo số tiềm cố định</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-1">
                  Giá trị{" "}
                  {discountData.discountType === "PERCENTAGE"
                    ? "(%):"
                    : "(VNĐ):"}
                </label>
                <input
                  type="number"
                  name="value"
                  value={discountData.value}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  disabled
                />
              </div>
              {discountData.discountType === "PERCENTAGE" && (
                <div>
                  <label className="block text-gray-300 mb-1">
                    Số tiền tối đa giảm được:
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={discountData.maxDiscount}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    disabled
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-1">
                  Ngày bắt đầu:
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={getDateTimeLocalValue(discountData.startDate)}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">
                  Ngày kết thúc:
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={getDateTimeLocalValue(discountData.endDate)}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  disabled
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">
                Số người dùng có thể sử dụng:
              </label>
              <input
                type="number"
                name="usageLimit"
                value={discountData.usageLimit}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                disabled
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-1">
                  Điều kiện người dùng sử dụng:
                </label>
                <select
                  name="eligibleUsers"
                  value={discountData.eligibleUsers}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  disabled
                >
                  <option value="NEW_USERS">Khách hàng mới</option>
                  <option value="ALL_USERS">
                    Không giới hạn khách hàng sử dụng và số lần sử dụng
                  </option>
                  <option value="ONE_TIME_PER_USER">
                    Mỗi khách hàng chỉ dùng 1 lần
                  </option>
                </select>
              </div>
              {/* <div>
                <label className="block text-gray-300 mb-1">Trạng thái:</label>
                <select
                  name="status"
                  value={discountData.status}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Không hoạt động</option>
                </select>
              </div> */}
            </div>
          </div>
          <div>
            <TableCategoryAndCourses
              applicableCategories={discountData.applicableCategories}
              setApplicableCategories={(newCategories) =>
                setDiscountData((prev) => ({
                  ...prev,
                  applicableCategories: newCategories,
                }))
              }
              applicableCourses={discountData.applicableCourses}
              setApplicableCourses={(newCourses) =>
                setDiscountData((prev) => ({
                  ...prev,
                  applicableCourses: newCourses,
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          {/* <button
            type="submit"
            disabled={loading}
            className="py-2 px-6 w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-center"
          >
            {loading ? "Đang Lưu..." : "Lưu Thay Đổi"}
          </button> */}
          {/* <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="py-2 px-6 w-full max-w-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-center"
          >
            {loading ? "Đang Xóa..." : "Xóa Discount"}
          </button> */}
        </div>
      </form>
    </div>
  );
};
export default EditDiscount;
