import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlinePlayCircle } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ListLectureFree from "./ListLectureFree";
import { BsClock } from "react-icons/bs";
import { 
  Video,
  Download,
  Smartphone,
  Award,
  Clock,
  Infinity as InfinityIcon,
  Globe,
  GraduationCap,
  MonitorPlay,
  BookOpen,
  FileText,
  MessageCircle,
  Users,
  Trophy
} from 'lucide-react';

const getResourceIcon = (description) => {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('video')) return { icon: Video, color: 'text-blue-500', bgColor: 'bg-blue-100' };
  if (lowerDesc.includes('tải') || lowerDesc.includes('download')) return { icon: Download, color: 'text-purple-500', bgColor: 'bg-purple-100' };
  if (lowerDesc.includes('mobile') || lowerDesc.includes('điện thoại')) return { icon: Smartphone, color: 'text-green-500', bgColor: 'bg-green-100' };
  if (lowerDesc.includes('truy cập')) return { icon: InfinityIcon, color: 'text-orange-500', bgColor: 'bg-orange-100' };
  if (lowerDesc.includes('chứng chỉ')) return { icon: GraduationCap, color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
  if (lowerDesc.includes('hỗ trợ')) return { icon: MessageCircle, color: 'text-teal-500', bgColor: 'bg-teal-100' };
  if (lowerDesc.includes('giảng dạy')) return { icon: MonitorPlay, color: 'text-rose-500', bgColor: 'bg-rose-100' };
  if (lowerDesc.includes('tài liệu')) return { icon: FileText, color: 'text-gray-500', bgColor: 'bg-gray-100' };
  if (lowerDesc.includes('học viên')) return { icon: Users, color: 'text-cyan-500', bgColor: 'bg-cyan-100' };
  if (lowerDesc.includes('sách')) return { icon: BookOpen, color: 'text-emerald-500', bgColor: 'bg-emerald-100' };
  if (lowerDesc.includes('online')) return { icon: Globe, color: 'text-indigo-500', bgColor: 'bg-indigo-100' };

  // Default icon
  return { icon: Trophy, color: 'text-blue-500', bgColor: 'bg-blue-100' };
};

const CourseMedia = ({
  price,
  thumbnail = "default-thumbnail.jpg",
  onAddToCart,
  resourceDescription = [],
}) => {
  // Tính giá sau giảm giá
  const discount = 30; // Mặc định giảm giá 30%
  const discountedPrice = Math.floor(price * (1 - discount / 100));
  const daysLeft = 3;
  
  const userId = Number(localStorage.getItem("userId"));
  const { courseId } = useParams();
  const [error, setError] = useState(null);
  const [checkCart, setCheckCart] = useState(false);
  const [checkFavorite, setCheckFavorite] = useState(false);
  const [checkOnStudy, setCheckOnStudy] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lectures, setLectures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatusesAndLectures = async () => {
      try {
        const [cartResponse, favoriteResponse, studyResponse, lecturesResponse] =
          await Promise.all([
            axios.get(`http://localhost:8080/api/student/cart/check/${userId}/${courseId}`),
            axios.get(`http://localhost:8080/api/student/wishlist/check/${userId}/${courseId}`),
            axios.get(`http://localhost:8080/api/student/enrollments/check/${userId}/${courseId}`),
            axios.get(`http://localhost:8080/api/student/lectures/${courseId}`),
          ]);

        setCheckCart(cartResponse.data);
        setCheckFavorite(favoriteResponse.data);
        setCheckOnStudy(studyResponse.data);
        setLectures(lecturesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu, vui lòng thử lại sau.");
      }
    };

    if (userId && courseId) {
      fetchStatusesAndLectures();
    } else {
      setError("Không tìm thấy mã người dùng hoặc mã khóa học.");
    }
  }, [userId, courseId]);

  const handleFavoriteToggle = async () => {
    setCheckFavorite(!checkFavorite);

    const requestData = {
      userId,
      courseId,
      createdAt: new Date(),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/student/add-wishlist",
        requestData
      );

      if (response.status === 200) {
        toast.success(
          checkFavorite
            ? "Xóa khỏi Wishlist thành công"
            : "Thêm vào Wishlist thành công"
        );
      } else {
        throw new Error("Không thể cập nhật danh sách yêu thích.");
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      toast.error("Thực hiện thất bại.");
    }
  };

  const onGoToCart = () => navigate(`/student/cart`);
  const onStartLearning = () => navigate(`/student/list-my-course`);
  const handleBuyNow = () => {
    onAddToCart();
    navigate(`/student/cart`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 max-w-[400px] w-full sticky top-[100px] overflow-hidden">
      {/* Thumbnail */}
      <div className="relative group">
        <img
          src={thumbnail}
          alt="Course Preview"
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => setShowPreview(true)}
            className="flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <AiOutlinePlayCircle className="text-white text-5xl mb-2" />
            <span className="text-white font-medium">Xem trước khóa học</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              đ{discountedPrice.toLocaleString('vi-VN')}
            </span>
            <span className="text-lg text-gray-500 line-through">
              đ{price.toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 font-semibold">
              Giảm {discount}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-red-500">
            <BsClock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {daysLeft} ngày còn lại với mức giá này!
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {checkOnStudy ? (
            <button
              onClick={onStartLearning}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-md font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Học ngay
            </button>
          ) : (
            <>
              <button
                onClick={handleBuyNow}
                className="w-full bg-white text-gray-800 py-3 rounded-md font-semibold text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Mua ngay
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={checkCart ? onGoToCart : onAddToCart}
                  className="flex-1 py-3 rounded-md font-semibold text-lg transition-all duration-300 bg-purple-600 text-white hover:bg-purple-700"
                >
                  {checkCart ? "Đến giỏ hàng" : "Thêm vào giỏ hàng"}
                </button>

                <button
                  onClick={handleFavoriteToggle}
                  className="w-12 h-12 flex items-center justify-center rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300 group"
                >
                  {checkFavorite ? (
                    <AiFillHeart className="text-2xl text-red-500 group-hover:scale-110 transition-transform" />
                  ) : (
                    <AiOutlineHeart className="text-2xl text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Award className="w-5 h-5 text-green-500" />
            <span className="font-medium">Đảm bảo hoàn tiền trong 30 ngày</span>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-6 text-lg flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-500" />
            <span>Khóa học này bao gồm:</span>
          </h3>
          <ul className="space-y-4">
            {resourceDescription.length > 0 ? (
              resourceDescription.map((item, index) => {
                const { icon: IconComponent, color, bgColor } = getResourceIcon(item);
                return (
                  <li 
                    key={index} 
                    className="flex items-center gap-4 text-gray-700 hover:text-gray-900 transition-colors group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${bgColor} ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-medium leading-tight">{item}</span>
                  </li>
                );
              })
            ) : (
              <li className="text-gray-500 italic text-center py-4 flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Chưa có thông tin về tài nguyên khóa học</span>
              </li>
            )}
          </ul>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <ListLectureFree
          onClose={() => setShowPreview(false)}
          lectures={lectures}
        />
      )}
    </div>
  );
};

export default CourseMedia;