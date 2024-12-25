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
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300"
      onClick={handleCardClick}
    >
      {/* Hình ảnh và tiêu đề */}
      <div className="relative h-[14rem] overflow-hidden">
        <img
          src={course.images[0]}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>
        <h2 className="absolute bottom-3 left-3 text-white text-base font-semibold line-clamp-2">
          {course.title}
        </h2>
        <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded-full shadow-md flex items-center">
          <FaStar className="mr-1 text-white" /> {course.rating} ★
        </span>
      </div>

      {/* Nội dung */}
      <div className="p-5">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-gray-700 mb-4">
          <div className="flex items-center text-blue-600 text-sm font-medium">
            <FaClock className="mr-1 text-sm" /> {course.duration}
          </div>
          <div className="flex items-center text-green-600 text-base font-bold">
            {new Intl.NumberFormat("vi-VN").format(course.price)}₫
          </div>
        </div>

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
