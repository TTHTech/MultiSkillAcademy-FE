import { FaClock, FaStar, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const userId = Number(localStorage.getItem("userId"));
const WishlistCard = ({ course, onDelete }) => {
  const navigate = useNavigate();
  const handleDelete = async (e) => {
    e.stopPropagation();
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn xóa khóa học này ra khỏi Wishlist này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (swalResult.isDismissed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/student/delete-course`, {
        data: { courseId: course.courseId, userId: userId, createdAt: " " },
      });

      await Swal.fire({
        title: "Confirmation",
        text: "Đã xóa khóa học khỏi Wishlist thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });

      onDelete(course.courseId);
    } catch (error) {
      console.error("Error deleting course from wishlist:", error);
    }
  };
  const handleCardClick = () => {
    navigate(`/course/${course.courseId}`);
  };
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform hover:scale-105 duration-300 w-64"
      onClick={handleCardClick}
    >
      {/* Phần hình ảnh và tiêu đề */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.images[0]}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* Hiệu ứng gradient che phần dưới */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>
        {/* Tiêu đề khóa học */}
        <h2 className="absolute bottom-3 left-3 text-white text-base font-semibold line-clamp-2">
          {course.title}
        </h2>
        {/* Đánh giá */}
        <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded-full flex items-center shadow-sm">
          <FaStar className="mr-1 text-white" /> {course.rating} ★
        </span>
      </div>

      {/* Nội dung chi tiết khóa học */}
      <div className="p-4">
        {/* Mô tả ngắn */}
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Thông tin thời lượng và giá */}
        <div className="flex items-center justify-between text-gray-700 mb-4">
          <div className="flex items-center text-blue-600 text-xs font-medium">
            <FaClock className="mr-1 text-sm" /> {course.duration}
          </div>
          <div className="flex items-center text-green-600 text-sm font-bold">
            {new Intl.NumberFormat("vi-VN").format(course.price)}
          </div>
        </div>

        {/* Nút Xóa */}
        <button
          className="w-full bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition-colors duration-200 flex items-center justify-center shadow-sm"
          onClick={handleDelete}
        >
          <FaTrash className="mr-1 text-sm" /> Xóa khỏi Wishlist
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
