import { useState, useEffect } from "react";
import axios from "axios";
import TableCategoryAndCourses from "./tableCategoryAndCourses";
import Swal from "sweetalert2";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const EditPromotion = ({ promotionId, onCancel, triggerRefresh }) => {
  const [promoData, setPromoData] = useState({
    createdBy: Number(localStorage.getItem("userId")) || 1,
    name: "",
    description: "",
    percentage: "",
    maxPromotion: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    applicableCategories: [],
    applicableCourses: [],
    stackableWithDiscount: true,
  });
  const [loading, setLoading] = useState(false);
  const formatForInput = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };
  const toDate = (isoStringOrArray) => {
    if (typeof isoStringOrArray === "string") {
      const normalized = isoStringOrArray.replace(/\.(\d{3})\d+/, ".$1");
      return new Date(normalized);
    }
    const [y, m, d, h = 0, min = 0, s = 0] = isoStringOrArray.map(Number);
    return new Date(y, m - 1, d, h, min, s);
  };

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${baseUrl}/api/admin/promotion/${promotionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setPromoData({
          createdBy: data.createdBy,
          name: data.name || "",
          description: data.description || "",
          percentage: data.percentage?.toString() || "",
          maxPromotion: data.maxPromotion?.toString() || "",
          startDate: data.startDate ? formatForInput(toDate(data.startDate)) : "",
          endDate: data.endDate ? formatForInput(toDate(data.endDate)) : "",
          status: data.status,
          applicableCategories: data.applicableCategories || [],
          applicableCourses: data.applicableCourses || [],
          stackableWithDiscount: data.stackableWithDiscount ?? true,
        });
      } catch (err) {
        Swal.fire("Lỗi", "Không thể tải thông tin Promotion.", "error");
      }
    };
    fetchPromotion();
  }, [promotionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromoData({ ...promoData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // validation (tương tự Create)
    if (
      !promoData.name ||
      !promoData.percentage ||
      !promoData.startDate ||
      !promoData.endDate
    ) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc", "error");
      setLoading(false);
      return;
    }
    const pct = parseFloat(promoData.percentage);
    if (pct < 10 || pct > 70) {
      Swal.fire("Lỗi", "Phần trăm phải trong khoảng 10 - 70", "error");
      setLoading(false);
      return;
    }
    if (promoData.maxPromotion && parseFloat(promoData.maxPromotion) < 10000) {
      Swal.fire("Lỗi", "Giá trị giảm tối đa phải >= 10.000 VND", "error");
      setLoading(false);
      return;
    }
    if (
      !promoData.applicableCourses ||
      promoData.applicableCourses.length === 0
    ) {
      Swal.fire(
        "Lỗi",
        "Bạn phải chọn ít nhất 1 khóa học áp dụng giảm giá",
        "error"
      );
      setLoading(false);
      return;
    }
    const start = new Date(promoData.startDate);
    const end = new Date(promoData.endDate);
    const now = new Date();
    if (start >= end) {
      Swal.fire("Lỗi", "Start Date phải sớm hơn End Date", "error");
      setLoading(false);
      return;
    }
    if (end < now) {
      Swal.fire("Lỗi", "End Date không thể nhỏ hơn hiện tại", "error");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/api/admin/promotion/${promotionId}`,
        {
          ...promoData,
          percentage: pct,
          maxPromotion: promoData.maxPromotion
            ? parseFloat(promoData.maxPromotion)
            : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Thành công", "Promotion đã được cập nhật!", "success");
      triggerRefresh();
      onCancel();
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", err.response?.data || err.message, "error");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa Promotion?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${baseUrl}/api/admin/promotion/${promotionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Đã xóa", "Promotion đã bị xóa.", "success");
      triggerRefresh();
      onCancel();
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", err.response?.data || err.message, "error");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-4 overflow-x-auto">
      <button
        onClick={onCancel}
        className="mb-4 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-200"
      >
        &larr; Quay lại danh sách Promotion
      </button>
      <h2 className="text-2xl font-bold mb-4 text-white">
        Chỉnh sửa Promotion
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Tên Promotion:</label>
              <input
                type="text"
                name="name"
                value={promoData.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
            </div>
            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Mô tả:</label>
              <textarea
                name="description"
                value={promoData.description}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                rows={3}
              />
            </div>
            {/* Percentage & Max */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-1">
                  Phần trăm (%):
                </label>
                <input
                  type="number"
                  name="percentage"
                  value={promoData.percentage}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Giảm tối đa:</label>
                <input
                  type="number"
                  name="maxPromotion"
                  value={promoData.maxPromotion}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                />
              </div>
            </div>
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-1">Start Date:</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={promoData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">End Date:</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={promoData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
            </div>
            {/* Status */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Trạng thái:</label>
              <select
                name="status"
                value={promoData.status}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
            </div>
            {/* stackableWithDiscount */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">
                Có thể kết hợp với Discount hay không?
              </label>
              <select
                name="stackableWithDiscount"
                value={promoData.stackableWithDiscount ? "true" : "false"}
                onChange={(e) =>
                  setPromoData({
                    ...promoData,
                    stackableWithDiscount: e.target.value === "true",
                  })
                }
                className="w-full p-2 bg-gray-700 text-white rounded"
              >
                <option value="true">Có thể kết hợp</option>
                <option value="false">Không thể kết hợp</option>
              </select>
            </div>
          </div>
          <div>
            <TableCategoryAndCourses
              applicableCategories={promoData.applicableCategories}
              setApplicableCategories={(newCats) =>
                setPromoData((prev) => ({
                  ...prev,
                  applicableCategories: newCats,
                }))
              }
              applicableCourses={promoData.applicableCourses}
              setApplicableCourses={(newCourses) =>
                setPromoData((prev) => ({
                  ...prev,
                  applicableCourses: newCourses,
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-6 w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
            {loading ? "Đang Lưu..." : "Lưu Thay Đổi"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="py-2 px-6 w-full max-w-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
          >
            {loading ? "Đang Xóa..." : "Xóa Promotion"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPromotion;
