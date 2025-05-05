import { useState, useEffect } from "react";
import Swal from "sweetalert2";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Details = ({ course, categories, languages, onEditingChange, triggerRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: course.category?.name || course.category || "",
    title: course.title || "",
    description: course.description || "",
    price: course.price || "",
    language: course.language || "",
    level: course.level || "",
    duration: course.duration || "",
  });
  const startEditing = () => {
    setIsEditing(true);
    onEditingChange && onEditingChange(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
    onEditingChange && onEditingChange(false);
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing) {
        const confirmationMessage =
          "Các thao tác sửa đổi của bạn có thể không được lưu.";
        e.preventDefault();
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing]);
  const handleUpdate = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "categoryName",
      "title",
      "description",
      "price",
      "language",
      "level",
      "duration",
    ];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `Please fill out the ${field} field.`,
        });
        return;
      }
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/instructor/update-course/${course.courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: errorText,
        });
      } else {
        const resMessage = await response.text();
        Swal.fire({
          icon: "success",
          title: "Update Successful",
          text: resMessage,
        });
        stopEditing();
        setIsEditing(false);
        triggerRefresh();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };
  return (
    <div className="bg-white p-4 w-full text-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-center">{course.title}</h1>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
            <p className="text-gray-500 text-sm italic">
              Tiêu đề của bạn không những phải thu hút sự chú ý, chứa nhiều
              thông tin mà còn được tối ưu hóa để dễ tìm kiếm.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-bold">Category:</label>
            <select
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-sm italic">
              Chọn danh mục phù hợp giúp khóa học của bạn được phân loại chính
              xác và dễ dàng tìm kiếm.
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
              rows="4"
            ></textarea>
            <p className="text-gray-500 text-sm italic">
              Mô tả chi tiết về khóa học, các nội dung, mục tiêu và lợi ích cho
              học viên.
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
            <p className="text-gray-500 text-sm italic">
              Nhập giá cho khóa học, đảm bảo nó phản ánh giá trị và phù hợp với
              thị trường.
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Language:</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-sm italic">
              Chọn ngôn ngữ giảng dạy giúp học viên dễ dàng theo chọn nội dung
              chính xác.
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Level:</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <p className="text-gray-500 text-sm italic">
              Chọn cấp độ phù hợp: Beginner, Intermediate, hoặc Advanced. Để học
              viên có thể xem xét chọn một cách phù hợp.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-bold">Duration:</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
            <p className="text-gray-500 text-sm italic">
              Nhập thời lượng khóa học (ví dụ: 10 hours) để học viên có thể lên
              kế hoạch học tập.
            </p>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={stopEditing}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-lg">
          <div className="fade-in">
            <p>
              <strong className="text-gray-700">Title:</strong>
              <span className="ml-2">{course.title}</span>
            </p>
            <p className="text-gray-500 text-sm italic">
              Tiêu đề của bạn không những phải thu hút sự chú ý, chứa nhiều
              thông tin mà còn được tối ưu hóa để dễ tìm kiếm.
            </p>
          </div>

          <div className="fade-in">
            <p>
              <strong className="text-gray-700">Category:</strong>
              <span className="ml-2">
                {course.category?.name || course.category}
              </span>
            </p>
            <p className="text-gray-500 text-sm italic">
              Chọn danh mục phù hợp giúp khóa học của bạn được phân loại chính
              xác và dễ dàng tìm kiếm.
            </p>
          </div>

          <div className="fade-in">
            <p>
              <strong className="text-gray-700">Description:</strong>
              <span className="ml-2">{course.description}</span>
            </p>
            <p className="text-gray-500 text-sm italic">
              Mô tả chi tiết về khóa học, các nội dung, mục tiêu và lợi ích cho
              học viên.
            </p>
          </div>

          <div className="fade-in">
            <p>
              <strong className="text-gray-700">Price:</strong>
              <span className="ml-2">{course.price.toLocaleString()} VND</span>
            </p>
            <p className="text-gray-500 text-sm italic">
              Nhập giá cho khóa học, đảm bảo nó phản ánh giá trị và phù hợp với
              thị trường.
            </p>
          </div>

          <div className="fade-in">
            <p>
              <strong className="text-gray-700">Language:</strong>
              <span className="ml-2">{course.language}</span>
            </p>
            <p className="text-gray-500 text-sm italic">
              Chọn ngôn ngữ giảng dạy giúp học viên dễ dàng theo dõi nội dung
              chính xác.
            </p>
          </div>

          <div className="fade-in">
            <p>
              <strong className="text-gray-700">Level:</strong>
              <span className="ml-2">{course.level}</span>
            </p>
            <p className="text-gray-500 text-sm italic">
              Chọn cấp độ phù hợp: Beginner, Intermediate, hoặc Advanced. Để học
              viên có thể xem xét chọn một cách phù hợp.
            </p>
          </div>

          <div className="fade-in">
            <p>
              <strong className="text-gray-700">Duration:</strong>
              <span className="ml-2">{course.duration}</span>
            </p>
            <p className="text-gray-500 text-sm italic">
              Nhập thời lượng khóa học (ví dụ: 10 hours) để học viên có thể lên
              kế hoạch học tập.
            </p>
          </div>

          <div className="mt-8 flex justify-end fade-in">
            <button
              onClick={startEditing}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
            >
              Edit Course Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
