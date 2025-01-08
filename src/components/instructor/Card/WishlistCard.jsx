import React, { useState } from 'react';
import { Clock, Star, Trash2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WishlistCard = ({ course, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const userId = Number(localStorage.getItem("userId"));

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/student/delete-course', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.courseId,
          userId: userId,
          createdAt: " "
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course from wishlist');
      }

      onDelete(course.courseId);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting course from wishlist:", error);
      setError("Failed to delete course. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/course/${course.courseId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <>
      <div 
        className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Course Image and Title Section */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={course.images[0]}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-white text-lg font-semibold line-clamp-2 mb-2">
              {course.title}
            </h2>
          </div>

          <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 text-yellow-500 font-semibold text-sm">
            <Star className="w-4 h-4" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Course Details Section */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{course.duration}</span>
            </div>
            <div className="text-green-600 font-bold">
              {formatPrice(course.price)}₫
            </div>
          </div>

          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa khỏi Wishlist</span>
          </button>
        </div>
      </div>

      {/* Custom Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa khóa học này ra khỏi Wishlist này?
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Không
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang xóa..." : "Có"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistCard;