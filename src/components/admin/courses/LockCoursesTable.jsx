import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Lucide icons
import { 
  BookOpen, 
  Search,
  Clock, 
  Globe, 
  GraduationCap, 
  LayoutList,
  Users,
  Wrench,
  CheckCircle,
  X,
  Star,
  User,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

// Constants
const ITEMS_PER_PAGE = 10;
const API_BASE_URL = `${baseUrl}/api`;

// Add CSS animations
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
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

.animate-slideInUp {
  animation: slideInUp 0.4s ease-out;
}

.hover\\:scale-102:hover {
  transform: scale(1.02);
}

.hover\\:scale-105:hover {
  transform: scale(1.05);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
`;

// Components
const SearchBar = ({ value, onChange }) => (
  <div className="relative w-72">
    <input
      type="text"
      placeholder="Search courses..."
      className="w-full bg-gray-800/80 text-white placeholder-gray-400 rounded-xl pl-11 pr-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
      value={value}
      onChange={onChange}
    />
    <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
  </div>
);

const CourseImageSlider = ({ images }) => (
  <div className="relative group flex justify-center mb-8">
    <Swiper
      modules={[Navigation, SwiperPagination]}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      navigation={true}
      pagination={{ clickable: true }}
      className="w-full h-[480px] rounded-2xl overflow-hidden shadow-xl 
                [&_.swiper-button-next]:text-white [&_.swiper-button-next]:bg-black/30 [&_.swiper-button-next]:w-12 [&_.swiper-button-next]:h-12 [&_.swiper-button-next]:rounded-full
                [&_.swiper-button-next]:opacity-0 [&_.swiper-button-next]:group-hover:opacity-80 [&_.swiper-button-next:hover]:bg-black/50
                [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:bg-black/30 [&_.swiper-button-prev]:w-12 [&_.swiper-button-prev]:h-12 [&_.swiper-button-prev]:rounded-full
                [&_.swiper-button-prev]:opacity-0 [&_.swiper-button-prev]:group-hover:opacity-80 [&_.swiper-button-prev:hover]:bg-black/50
                [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-60 [&_.swiper-pagination-bullet-active]:opacity-100"
    >
      {images?.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full overflow-hidden">
            <img
              src={image}
              alt={`Course Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
  </div>
);

const DetailField = ({ label, value, icon: Icon, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/40 rounded-xl p-5 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-300 border border-gray-700/30 shadow-md group"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
        <Icon size={20} className="text-indigo-400 group-hover:text-indigo-300" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
        <p className={`text-gray-100 ${className}`}>{value}</p>
      </div>
    </div>
  </motion.div>
);

const ListField = ({ label, items, icon: Icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/40 rounded-xl p-5 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-300 border border-gray-700/30 shadow-md"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-indigo-500/10 rounded-xl">
        <Icon size={20} className="text-indigo-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-white">{label}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items?.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-center gap-4 p-4 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-all duration-300"
        >
          <div className="flex-shrink-0 p-2 bg-indigo-500/10 rounded-lg">
            <CheckCircle size={16} className="text-indigo-400" strokeWidth={1.5} />
          </div>
          <span className="text-gray-200 text-sm font-medium min-w-0 break-words">{item}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const CourseDetails = ({ course, onAccept, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900/40 p-8 rounded-xl backdrop-blur-sm border border-gray-700/50 shadow-xl animate-fadeIn"
    >
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="mr-3 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-2xl font-bold text-white tracking-tight">Course Details</h3>
      </div>

      <CourseImageSlider images={course.imageUrls} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DetailField 
          label="Course Name"
          value={course.title}
          icon={BookOpen}
          className="font-semibold text-lg"
        />
        <DetailField 
          label="Rating"
          value={`${course.rating} Stars`}
          icon={Star}
        />
        <DetailField 
          label="Price"
          value={`$${course.price}`}
          icon={GraduationCap}
          className="text-emerald-400 font-semibold"
        />
        <DetailField 
          label="Instructor"
          value={`${course.instructorFirstName} ${course.instructorLastName}`}
          icon={User}
        />
        <DetailField 
          label="Duration"
          value={course.duration}
          icon={Clock}
        />
        <DetailField 
          label="Language"
          value={course.language}
          icon={Globe}
        />
        <DetailField 
          label="Category" 
          value={course.categoryName}
          icon={LayoutList}
        />
        <DetailField 
          label="Level" 
          value={course.level}
          icon={GraduationCap}
          className="capitalize"
        />
      </div>

      <DetailField
        label="Description"
        value={course.description}
        icon={BookOpen}
        className="leading-relaxed mb-8"
      />

      <div className="space-y-6 mb-8">
        <ListField 
          label="Requirements"
          items={course.requirements}
          icon={CheckCircle}
        />
        <ListField 
          label="Target Audience" 
          items={course.targetAudience} 
          icon={Users}
        />
        <ListField 
          label="Course Content" 
          items={course.courseContent} 
          icon={BookOpen}
        />
        <ListField 
          label="Resources" 
          items={course.resourceDescription} 
          icon={Wrench}
        />
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-700/50">
        <button
          className="flex-1 px-6 py-3.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-102"
          onClick={onCancel}
        >
          <X size={18} strokeWidth={1.5} />
          <span>Cancel</span>
        </button>
        <button
          className="flex-1 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-102"
          onClick={() => onAccept(course.courseId)}
        >
          <Unlock size={18} strokeWidth={1.5} />
          <span>Unlock Course</span>
        </button>
      </div>
    </motion.div>
  );
};

const CourseTableHeader = () => (
  <tr className="bg-gradient-to-r from-gray-800/90 to-gray-800/70">
    <th className="py-4 px-6 font-medium text-gray-300 text-sm uppercase tracking-wider">ID</th>
    <th className="py-4 px-6 font-medium text-gray-300 text-sm uppercase tracking-wider">Name</th>
    <th className="py-4 px-6 font-medium text-gray-300 text-sm uppercase tracking-wider">Duration</th>
    <th className="py-4 px-6 font-medium text-gray-300 text-sm uppercase tracking-wider">Category</th>
    <th className="py-4 px-6 font-medium text-gray-300 text-sm uppercase tracking-wider">Price</th>
    <th className="py-4 px-6 font-medium text-gray-300 text-sm uppercase tracking-wider">Status</th>
    <th className="py-4 px-6 font-medium text-gray-300 text-sm uppercase tracking-wider">Actions</th>
  </tr>
);

const CourseTableRow = ({ course, index, onView }) => (
  <tr className="bg-gray-800/30 hover:bg-gray-700/40 transition-colors duration-200 border-b border-gray-700/40">
    <td className="py-4 px-6 font-mono text-gray-400">{index + 1}</td>
    <td className="py-4 px-6 font-medium">{course.title}</td>
    <td className="py-4 px-6 text-gray-300">{course.duration}</td>
    <td className="py-4 px-6">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
        {course.categoryName}
      </span>
    </td>
    <td className="py-4 px-6 font-medium text-emerald-400">${course.price}</td>
    <td className="py-4 px-6">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
        <Lock size={12} className="mr-1" />
        {course.status}
      </span>
    </td>
    <td className="py-4 px-6">
      <button
        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
        onClick={() => onView(course)}
      >
        View Details
      </button>
    </td>
  </tr>
);

const PageButton = ({ page, currentPage, onClick }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 mx-1 rounded-lg flex items-center justify-center transition-all ${
      currentPage === page 
        ? "bg-indigo-600 text-white shadow-md" 
        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
    }`}
  >
    {page}
  </button>
);

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
      // Always show first page
      pages.push(
        <PageButton
          key={1}
          page={1}
          currentPage={currentPage}
          onClick={() => onPageChange(1)}
        />
      );

      // Add dots if needed
      if (currentPage > 3) {
        pages.push(<span key="dots-1" className="px-3 py-2 text-gray-500">...</span>);
      }

      // Add pages around current page
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(currentPage + 2, totalPages - 1); i++) {
        pages.push(
          <PageButton
            key={i}
            page={i}
            currentPage={currentPage}
            onClick={() => onPageChange(i)}
          />
        );
      }

      // Add dots if needed
      if (currentPage < totalPages - 2) {
        pages.push(<span key="dots-2" className="px-3 py-2 text-gray-500">...</span>);
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <PageButton
            key={totalPages}
            page={totalPages}
            currentPage={currentPage}
            onClick={() => onPageChange(totalPages)}
          />
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-8">
      <button
        className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={14} />
        <span>Previous</span>
      </button>

      <div className="flex items-center">{renderPageNumbers()}</div>

      <button
        className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <span>Next</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

// Main Component
const LockCoursesTable = () => {
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
        `${API_BASE_URL}/admin/courses/inactive`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses.");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
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
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAccept = async (courseId) => {
    if (!courseId) {
      console.error("Course ID is undefined");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "Active" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course status.");
      }

      toast.success("Course unlocked successfully!");
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseId)
      );
      setEditingCourse(null);
    } catch (error) {
      console.error("Error updating course status:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl p-6 shadow-md">
        <h3 className="font-semibold text-lg mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-700/50 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-1.5 h-8 bg-indigo-500 rounded-r mr-4" />
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <Lock size={20} className="mr-2" /> Locked Courses
          </h2>
        </div>
        <SearchBar value={searchTerm} onChange={handleSearch} />
      </div>

      {editingCourse ? (
        <CourseDetails
          course={editingCourse}
          onAccept={handleAccept}
          onCancel={() => setEditingCourse(null)}
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-lg">
            <table className="w-full text-left text-gray-100">
              <thead>
                <CourseTableHeader />
              </thead>
              <tbody className="divide-y divide-gray-700/40">
                {currentCourses.map((course, index) => (
                  <CourseTableRow
                    key={course.courseId || index}
                    course={course}
                    index={index}
                    onView={setEditingCourse}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredCourses.length > ITEMS_PER_PAGE && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl mt-6 border border-gray-700/30">
              <p className="text-gray-400">No courses match your search criteria.</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default LockCoursesTable;