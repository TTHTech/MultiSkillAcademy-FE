import { useState } from "react";
import axios from "axios";
import TableCategoryAndCourses from "./tableCategoryAndCourses";
import Swal from "sweetalert2";

const CreatePromotion = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromoData({ ...promoData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // validation
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
    if (!promoData.applicableCourses || promoData.applicableCourses.length === 0) {
      Swal.fire("Lỗi", "Bạn phải chọn ít nhất 1 khóa học áp dụng giảm giá", "error");
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

    const confirm = await Swal.fire({
      title: "Thêm Promotion?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });
    if (!confirm.isConfirmed) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      createdBy: promoData.createdBy,
      name: promoData.name,
      description: promoData.description,
      percentage: pct,
      maxPromotion: promoData.maxPromotion
        ? parseFloat(promoData.maxPromotion)
        : null,
      startDate: promoData.startDate,
      endDate: promoData.endDate,
      status: promoData.status,
      applicableCategories: promoData.applicableCategories,
      applicableCourses: promoData.applicableCourses,
      stackableWithDiscount: promoData.stackableWithDiscount,
    };

    try {
      await axios.post("http://localhost:8080/api/admin/promotion", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Thành công", "Promotion đã được tạo!", "success");
      // reset form
      setPromoData({
        ...promoData,
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
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        Swal.fire("Lỗi", err.response.data, "error");
      } else {
        Swal.fire("Lỗi", "Có lỗi khi tạo promotion: " + err.message, "error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Tạo Promotion</h2>
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
        <button
          type="submit"
          disabled={loading}
          className="mt-6 py-2 px-6 w-full max-w-xs mx-auto block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          {loading ? "Đang tạo..." : "Tạo Promotion"}
        </button>
      </form>
    </div>
  );
};

export default CreatePromotion;