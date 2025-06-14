import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaUserCircle, FaBook, FaTools, FaClipboardList, FaChevronLeft, FaChevronRight, FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Add CSS animations with more subtle transitions
const animationStyles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.98);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.4s ease-out;
}

.hover\\:scale-101:hover {
  transform: scale(1.01);
}
`;

// ImageGallery Component with refined styling
const ImageGallery = ({ images }) => (
  <div className="relative group flex justify-center mb-8">
    <Swiper
      modules={[Navigation, SwiperPagination]}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      navigation={true}
      pagination={{ clickable: true }}
      className="w-full h-[450px] rounded-md overflow-hidden 
                [&_.swiper-button-next]:text-white [&_.swiper-button-next]:bg-black/20 [&_.swiper-button-next]:w-10 [&_.swiper-button-next]:h-10 [&_.swiper-button-next]:rounded-full
                [&_.swiper-button-next]:opacity-0 [&_.swiper-button-next]:group-hover:opacity-70 [&_.swiper-button-next:hover]:bg-black/30
                [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:bg-black/20 [&_.swiper-button-prev]:w-10 [&_.swiper-button-prev]:h-10 [&_.swiper-button-prev]:rounded-full
                [&_.swiper-button-prev]:opacity-0 [&_.swiper-button-prev]:group-hover:opacity-70 [&_.swiper-button-prev:hover]:bg-black/30
                [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-50 [&_.swiper-pagination-bullet-active]:opacity-90"
    >
      {images?.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full overflow-hidden">
            <img
              src={image}
              alt={`Hình khóa học ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
  </div>
);

// DetailField Component with refined UI
const DetailField = ({ label, value, isTextArea = false, className = "" }) => (
  <div className={`mb-5 bg-slate-800/30 rounded-md p-3 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 group border border-slate-700/20 ${className}`}>
    <label className="block text-xs font-medium text-slate-400 mb-1.5 group-hover:text-slate-300 transition-colors">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        value={value}
        className="w-full p-2.5 bg-slate-700/30 text-slate-200 rounded-md border border-slate-600/30 focus:border-slate-500 focus:ring-1 focus:ring-slate-500/10 transition-all min-h-[120px] font-light text-sm"
        readOnly
      />
    ) : (
      <input
        type="text"
        value={value}
        className="w-full p-2.5 bg-slate-700/30 text-slate-200 rounded-md border border-slate-600/30 focus:border-slate-500 focus:ring-1 focus:ring-slate-500/10 transition-all font-light text-sm"
        readOnly
      />
    )}
  </div>
);

// SearchBar Component with refined design
const SearchBar = ({ searchTerm, onSearch }) => (
  <div className="relative w-64">
    <input
      type="text"
      placeholder="Tìm kiếm khóa học..."
      className="w-full bg-slate-800/80 text-slate-200 placeholder-slate-400 rounded-md pl-9 pr-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-slate-500/40 focus:border-slate-600 transition-all"
      onChange={onSearch}
      value={searchTerm}
    />
    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
  </div>
);

// CourseTable Component with refined UI
const CourseTable = ({ courses, onView }) => {
  // Hàm chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
  const getVietnameseStatus = (status) => {
    const statusMap = {
      'Pending': 'Chờ duyệt',
      'Active': 'Đã duyệt', 
      'Declined': 'Đã từ chối',
      'Draft': 'Bản nháp',
      'Inactive': 'Không hoạt động'
    };
    return statusMap[status] || status;
  };

  // Hàm lấy class cho trạng thái
  const getStatusClass = (status) => {
    const statusClasses = {
      'Pending': 'bg-amber-900/20 text-amber-300 border-amber-800/30',
      'Active': 'bg-green-900/20 text-green-300 border-green-800/30',
      'Declined': 'bg-red-900/20 text-red-300 border-red-800/30',
      'Draft': 'bg-gray-900/20 text-gray-300 border-gray-800/30',
      'Inactive': 'bg-slate-900/20 text-slate-300 border-slate-800/30'
    };
    return statusClasses[status] || 'bg-amber-900/20 text-amber-300 border-amber-800/30';
  };

  // Hàm định dạng giá tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="overflow-hidden rounded-md border border-slate-700/40 backdrop-blur-sm">
      <table className="w-full text-left text-slate-200">
        <thead>
          <tr className="bg-gradient-to-r from-slate-800/90 to-slate-800/70">
            <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">STT</th>
            <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Tên khóa học</th>
            <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Thời lượng</th>
            <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Danh mục</th>
            <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Giá</th>
            <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Trạng thái</th>
            <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {courses.map((course, index) => (
            <tr 
              key={course.id} 
              className="bg-slate-800/20 hover:bg-slate-700/30 transition-colors duration-200"
            >
              <td className="py-3 px-4 font-mono text-slate-500 text-sm">{index + 1}</td>
              <td className="py-3 px-4 font-medium text-sm">{course.title}</td>
              <td className="py-3 px-4 text-slate-300 text-sm">{course.duration}</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-600/30 text-slate-300 border border-slate-600/30">
                  {course.categoryName}
                </span>
              </td>
              <td className="py-3 px-4 font-medium text-teal-300 text-sm">{formatPrice(course.price)}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(course.status)}`}>
                  {getVietnameseStatus(course.status)}
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onView(course)}
                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-600/90 hover:bg-slate-500 text-white transition-all duration-200 font-medium text-xs"
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// CourseInfo Component with refined styling
const CourseInfo = ({ course }) => {
  // Hàm định dạng giá tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Hàm chuyển đổi cấp độ sang tiếng Việt
  const getVietnameseLevel = (level) => {
    const levelMap = {
      'Beginner': 'Người mới bắt đầu',
      'Intermediate': 'Trung cấp',
      'Advanced': 'Nâng cao',
      'Expert': 'Chuyên gia',
      'All Levels': 'Tất cả cấp độ'
    };
    return levelMap[level] || level;
  };

  // Hàm chuyển đổi ngôn ngữ
  const getVietnameseLanguage = (language) => {
    const languageMap = {
      'Vietnamese': 'Tiếng Việt',
      'English': 'Tiếng Anh',
      'French': 'Tiếng Pháp',
      'Chinese': 'Tiếng Trung',
      'Japanese': 'Tiếng Nhật',
      'Korean': 'Tiếng Hàn'
    };
    return languageMap[language] || language;
  };

  return (
    <div className="bg-slate-800/30 rounded-md p-5 mb-6 backdrop-blur-sm border border-slate-700/30">
      <div className="flex items-center mb-5">
        <div className="w-1 h-6 bg-slate-500 rounded-r mr-3" />
        <h3 className="text-lg font-medium text-slate-200">Chi tiết khóa học</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column - Basic Info */}
        <div className="space-y-5">
          <DetailField 
            label="Tên khóa học" 
            value={course.title} 
            className="border-l-2 border-slate-500"
          />
          <DetailField 
            label="Giảng viên" 
            value={`${course.instructorFirstName} ${course.instructorLastName}`}
            className="border-l-2 border-teal-700"
          />
          <DetailField 
            label="Danh mục" 
            value={course.categoryName}
            className="border-l-2 border-slate-600"
          />
          <DetailField 
            label="Giá" 
            value={formatPrice(course.price)}
            className="border-l-2 border-teal-800"
          />
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-5">
          <DetailField 
            label="Thời lượng" 
            value={course.duration}
            className="border-l-2 border-slate-500"
          />
          <DetailField 
            label="Ngôn ngữ" 
            value={getVietnameseLanguage(course.language)}
            className="border-l-2 border-slate-600"
          />
          <DetailField 
            label="Đánh giá" 
            value={`${course.rating}/5 ⭐`}
            className="border-l-2 border-slate-500"
          />
          <DetailField 
            label="Cấp độ" 
            value={getVietnameseLevel(course.level)}
            className="border-l-2 border-slate-600"
          />
        </div>

        {/* Full Width Description */}
        <div className="col-span-1 md:col-span-2">
          <DetailField 
            label="Mô tả" 
            value={course.description} 
            isTextArea 
            className="border-l-2 border-slate-500"
          />
        </div>
      </div>
    </div>
  );
};

// MetadataSection Component with refined styling
const MetadataSection = ({ label, items, icon: Icon }) => (
  <div className="mb-5 bg-slate-800/30 rounded-md p-3 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 border border-slate-700/20">
    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
      <Icon className="mr-2 text-slate-400" size={14} />
      {label}
    </h4>
    <ul className="space-y-2">
      {items?.map((item, idx) => (
        <li 
          key={idx} 
          className="flex items-start gap-2.5 p-2.5 bg-slate-700/30 rounded-md hover:bg-slate-700/50 transition-colors group"
        >
          <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span className="flex-1 text-slate-300 text-xs">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// CourseMetadata Component with refined styling
const CourseMetadata = ({ course }) => (
  <div className="bg-slate-800/30 rounded-md p-5 mb-6 backdrop-blur-sm border border-slate-700/30">
    <div className="flex items-center mb-5">
      <div className="w-1 h-6 bg-slate-500 rounded-r mr-3" />
      <h3 className="text-lg font-medium text-slate-200">Thông tin khóa học</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Left Column */}
      <div>
        <MetadataSection
          label="Đối tượng"
          items={course.targetAudience}
          icon={FaUserCircle}
        />
        <MetadataSection
          label="Yêu cầu"
          items={course.requirements}
          icon={FaClipboardList}
        />
      </div>

      {/* Right Column */}
      <div>
        <MetadataSection
          label="Nội dung khóa học"
          items={course.courseContent}
          icon={FaBook}
        />
        <MetadataSection
          label="Tài nguyên"
          items={course.resourceDescription}
          icon={FaTools}
        />
      </div>
    </div>
  </div>
);

// ActionButtons Component with refined styling
const ActionButtons = ({ courseId, onAccept, onReject, onCancel }) => (
  <div className="flex gap-3 pt-4 border-t border-slate-700/30">
    <button
      className="flex-1 bg-teal-900 hover:bg-teal-800 text-slate-200 px-4 py-2.5 rounded-md transition-all flex items-center justify-center gap-2 font-medium text-sm transform hover:scale-101"
      onClick={() => onAccept(courseId)}
    >
      <FaCheck size={12} />
      <span>Duyệt</span>
    </button>
    <button
      className="flex-1 bg-red-900 hover:bg-red-800 text-slate-200 px-4 py-2.5 rounded-md transition-all flex items-center justify-center gap-2 font-medium text-sm transform hover:scale-101"
      onClick={() => onReject(courseId)}
    >
      <FaTimes size={12} />
      <span>Từ chối</span>
    </button>
    <button
      className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2.5 rounded-md transition-all flex items-center justify-center gap-2 font-medium text-sm transform hover:scale-101"
      onClick={onCancel}
    >
      <FaArrowLeft size={12} />
      <span>Quay lại</span>
    </button>
  </div>
);

// CourseDetailView Component with refined styling
const CourseDetailView = ({ course, onAccept, onReject, onCancel }) => {
  const { courseId } = course;
  
  return (
    <div className="bg-slate-800/30 rounded-md p-6 backdrop-blur-sm border border-slate-700/30 animate-fadeIn">
      <div className="flex items-center mb-5">
        <button
          onClick={onCancel}
          className="mr-3 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <FaArrowLeft size={14} />
        </button>
        <h3 className="text-xl font-medium text-slate-200">Xem xét khóa học</h3>
      </div>
    
      <ImageGallery images={course.imageUrls} />
      <CourseInfo course={course} />
      <CourseMetadata course={course} />
      <ActionButtons
        courseId={courseId}
        onAccept={onAccept}
        onReject={onReject}
        onCancel={onCancel}
      />
    </div>
  );
};

// PageButton Component with refined UI
const PageButton = ({ page, currentPage, onClick }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 mx-1 rounded-md flex items-center justify-center transition-all text-sm ${
      currentPage === page 
        ? "bg-slate-600 text-white" 
        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
    }`}
  >
    {page}
  </button>
);

// Pagination Component with refined UI
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PageButton
            key={i}
            page={i}
            currentPage={currentPage}
            onClick={() => onPageChange(i)}
          />
        );
      }
    } else {
      if (currentPage <= 4) {
        // First 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(
            <PageButton
              key={i}
              page={i}
              currentPage={currentPage}
              onClick={() => onPageChange(i)}
            />
          );
        }
        pages.push(<span key="dots-end" className="px-2 py-2 text-slate-500">…</span>);
        // Last page
        pages.push(
          <PageButton
            key={totalPages}
            page={totalPages}
            currentPage={currentPage}
            onClick={() => onPageChange(totalPages)}
          />
        );
      } else if (currentPage > 4 && currentPage <= totalPages - 4) {
        pages.push(
          <PageButton
            key={1}
            page={1}
            currentPage={currentPage}
            onClick={() => onPageChange(1)}
          />
        );
        pages.push(<span key="dots-start" className="px-2 py-2 text-slate-500">…</span>);

        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(
            <PageButton
              key={i}
              page={i}
              currentPage={currentPage}
              onClick={() => onPageChange(i)}
            />
          );
        }

        pages.push(<span key="dots-end" className="px-2 py-2 text-slate-500">…</span>);
        pages.push(
          <PageButton
            key={totalPages}
            page={totalPages}
            currentPage={currentPage}
            onClick={() => onPageChange(totalPages)}
          />
        );
      } else {
        pages.push(
          <PageButton
            key={1}
            page={1}
            currentPage={currentPage}
            onClick={() => onPageChange(1)}
          />
        );
        pages.push(<span key="dots-start" className="px-2 py-2 text-slate-500">…</span>);

        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(
            <PageButton
              key={i}
              page={i}
              currentPage={currentPage}
              onClick={() => onPageChange(i)}
            />
          );
        }
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <button
        className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <FaChevronLeft size={12} />
        <span className="text-sm">Trước</span>
      </button>

      <div className="flex items-center">{renderPageNumbers()}</div>

      <button
        className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <span className="text-sm">Sau</span>
        <FaChevronRight size={12} />
      </button>
    </div>
  );
};

// Main CoursesTable Component
const ITEMS_PER_PAGE = 10;

const CoursesTable = () => {
  // Inject animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/courses/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải khóa học.");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const updateCourseStatus = async (courseId, status) => {
    if (!courseId) {
      console.error("ID khóa học không xác định");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/admin/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Không thể ${status === 'Active' ? 'duyệt' : 'từ chối'} khóa học.`);
      }

      toast.success(`Khóa học đã được ${status === 'Active' ? 'duyệt' : 'từ chối'} thành công!`);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseId)
      );
      setEditingCourse(null);
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái khóa học:`, error);
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  const handleAccept = (courseId) => updateCourseStatus(courseId, "Active");
  const handleReject = (courseId) => updateCourseStatus(courseId, "Declined");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-400"></div>
          <p className="mt-4 text-slate-400 text-sm">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/10 border border-red-900/30 text-red-300 rounded-md p-4">
        <h3 className="font-medium text-base mb-1">Lỗi</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-md p-6 border border-slate-700/40 mb-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-slate-500 rounded-r mr-3" />
          <h2 className="text-xl font-medium text-slate-200">
            Khóa học chờ duyệt
          </h2>
        </div>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearch={handleSearch} 
        />
      </div>

      {editingCourse ? (
        <CourseDetailView
          course={editingCourse}
          onAccept={handleAccept}
          onReject={handleReject}
          onCancel={() => setEditingCourse(null)}
        />
      ) : (
        <>
          <CourseTable
            courses={currentCourses}
            onView={setEditingCourse}
          />
          
          {filteredCourses.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-10 bg-slate-800/20 rounded-md mt-5 border border-slate-700/20">
              <p className="text-slate-400 text-sm">Không tìm thấy khóa học phù hợp với từ khóa tìm kiếm.</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default CoursesTable;