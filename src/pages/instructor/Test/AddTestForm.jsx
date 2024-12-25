import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddTestForm = ({ onClose, onTestAdded, courses }) => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      courseId: "",
      duration: 0,
      questionCount: 0,
      correctAnswersRequired: 0,
      questions: [],
    });
  
    const token = localStorage.getItem("token");
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.courseId.trim() === "") {
            await Swal.fire({
              title: "Thông báo",
              text: "Vui lòng chọn Khóa Học.",
              icon: "warning",
              confirmButtonText: "OK",
            });
            return;
          }
          if (formData.title.trim() === "") {
            await Swal.fire({
              title: "Thông báo",
              text: "Vui lòng nhập Tiêu Đề.",
              icon: "warning",
              confirmButtonText: "OK",
            });
            return;
          }
          if (formData.description.trim() === "") {
            await Swal.fire({
              title: "Thông báo",
              text: "Vui lòng nhập Mô Tả.",
              icon: "warning",
              confirmButtonText: "OK",
            });
            return;
          }
          const swalResult = await Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn thêm bài Test này?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          });
        
          if (swalResult.isDismissed) {
            return;
          }
        try {
          const response = await axios.post("http://localhost:8080/api/instructor/addTest", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          onTestAdded(response.data);
          onClose();
          window.location.reload();
          await Swal.fire({
            title: "Confirmation",
            text: "Thêm bài Test thành công",
            icon: "success",
            confirmButtonText: "Yes",
          });
        } catch (error) {
            console.error("Error adding test:", error);
            await Swal.fire({
              title: "Lỗi",
              text: "Đã xảy ra lỗi khi thêm bài kiểm tra.",
              icon: "error",
              confirmButtonText: "OK",
            });
        }
      };
      
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Thêm bài kiểm tra mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Khóa học</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Chọn khóa học --</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Số câu hỏi</label>
              <input
                type="number"
                name="questionCount"
                value={formData.questionCount}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Thời gian (phút)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 mr-4"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            >
              Thêm bài kiểm tra
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default AddTestForm;
  
