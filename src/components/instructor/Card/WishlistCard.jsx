import { FaClock, FaDollarSign, FaStar, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const WishlistCard = ({ course, onDelete }) => {
  const handleDelete = async () => {
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
        data: { courseId: course.courseId, userId: 16, createdAt: " " },
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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.images[0]}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-75"></div>
        <h2 className="absolute bottom-2 left-2 text-white text-lg font-semibold">
          {course.title}
        </h2>
        <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded flex items-center">
          <FaStar className="mr-1" /> {course.rating} ★
        </span>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm truncate mb-3 line-clamp-1">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-gray-700 text-sm mb-3">
          <div className="flex items-center">
            <FaClock className="mr-1 text-blue-500" /> {course.duration}
          </div>
          <div className="flex items-center font-semibold text-lg text-green-500">
            <FaDollarSign className="mr-1" /> {course.price.toFixed(2)}
          </div>
        </div>

        <button
          className="w-full bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition-colors duration-200 flex items-center justify-center mb-1"
          onClick={handleDelete}
        >
          <FaTrash className="mr-2" /> Xóa khỏi Wishlist
        </button>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
          onClick={handleDelete}
        >
          <FaSearch className="mr-2" /> Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
