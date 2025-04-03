import { useState } from "react";
import axios from "axios";
import TableCategoryAndCourses from "./tableCategoryAndCourses";
import Swal from "sweetalert2";

const CreateDiscount = () => {
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
    status: "ACTIVE",
    applicableCategories: [],
    applicableCourses: [],
  });

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
      title: "Bạn có muốn thêm Discount?",
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
      await axios.post("http://localhost:8080/api/admin/discounts", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("Thành công", "Discount đã được tạo thành công!", "success");
      setDiscountData({
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
        status: "ACTIVE",
        applicableCategories: [],
        applicableCourses: [],
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        Swal.fire("Lỗi", err.response.data, "error");
      } else {
        Swal.fire(
          "Lỗi",
          "Có lỗi xảy ra khi tạo discount: " + err.message,
          "error"
        );
      }
    }
    setLoading(false);
  };
  return (
    <div className="overflow-x-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Tạo Discount</h2>
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
                required
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
                required
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
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Dạng giảm giá:</label>
              <select
                name="discountType"
                value={discountData.discountType}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
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
                  required
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
                    required
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
                  value={discountData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">
                  Ngày kết thúc:
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={discountData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
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
                required
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
                >
                  <option value="NEW_USERS">Người dùng mới</option>
                  <option value="ALL_USERS">Tất cả người dùng</option>
                  <option value="ONE_TIME_PER_USER">
                    Mỗi người dùng 1 lần
                  </option>
                </select>
              </div>
              <div>
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
              </div>
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
        <button
          type="submit"
          disabled={loading}
          className="mt-6 py-2 px-6 w-full max-w-xs mx-auto block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-center"
        >
          {loading ? "Đang tạo..." : "Tạo Discount"}
        </button>
      </form>
    </div>
  );
};
export default CreateDiscount;
