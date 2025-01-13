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
  User
} from 'lucide-react';


// Constants
const ITEMS_PER_PAGE = 10;
const API_BASE_URL = "http://localhost:8080/api";

// Components
const SearchBar = ({ value, onChange }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search courses..."
      className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
    />
    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
  </div>
);

const CourseImageSlider = ({ images }) => (
  <div className="relative group">
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      navigation={true}
      className="w-full h-96 [&_.swiper-button-next]:text-white [&_.swiper-button-next]:opacity-0 [&_.swiper-button-next]:group-hover:opacity-100 [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:opacity-0 [&_.swiper-button-prev]:group-hover:opacity-100 [&_.swiper-pagination-bullet]:bg-white"
    >
      {images?.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full overflow-hidden rounded-lg">
            <img
              src={image}
              alt={`Course Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
  </div>
);
const DetailField = ({ label, value, icon: Icon, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 hover:bg-gray-800/60 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50 group"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
        <Icon size={22} className="text-blue-400 group-hover:text-blue-300" strokeWidth={1.5} />
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
    className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-blue-500/10 rounded-xl">
        <Icon size={22} className="text-blue-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-gray-100">{label}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items?.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
        >
          <div className="flex-shrink-0 p-2 bg-emerald-500/10 rounded-lg">
            <CheckCircle size={16} className="text-emerald-400" strokeWidth={1.5} />
          </div>
          <span className="text-gray-300 font-medium min-w-0 break-words">{item}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const CourseDetails = ({ course, onAccept, onCancel }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="bg-gray-900/90 backdrop-blur-xl p-8 rounded-2xl space-y-8 max-w-5xl mx-auto shadow-2xl"
    >
      <div className="relative rounded-xl overflow-hidden">
        <CourseImageSlider images={course.imageUrls} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailField 
          label="Title"
          value={course.title}
          icon={BookOpen}
          className="font-semibold"
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
        className="leading-relaxed"
      />

      <div className="space-y-6">
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

      <motion.div 
        variants={fadeInUp}
        className="flex justify-end gap-4 pt-6 border-t border-gray-700/50"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-100 rounded-xl hover:bg-gray-600 transition-all duration-300"
          onClick={onCancel}
        >
          <X size={18} strokeWidth={1.5} />
          <span className="font-medium">Cancel</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300"
          onClick={() => onAccept(course.courseId)}
        >
          <CheckCircle size={18} strokeWidth={1.5} />
          <span className="font-medium">Unlock Course</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
const CourseTableHeader = () => (
  <tr className="border-b bg-gray-700">
    <th className="py-2 px-4">ID</th>
    <th className="py-2 px-4">Name</th>
    <th className="py-2 px-4">Duration</th>
    <th className="py-2 px-4">Category</th>
    <th className="py-2 px-4">Price</th>
    <th className="py-2 px-4">Status</th>
    <th className="py-2 px-4">Actions</th>
  </tr>
);

const CourseTableRow = ({ course, index, onView }) => (
  <tr className="border-b bg-gray-800 hover:bg-gray-700 transition-colors">
    <td className="py-2 px-4">{index + 1}</td>
    <td className="py-2 px-4">{course.title}</td>
    <td className="py-2 px-4">{course.duration}</td>
    <td className="py-2 px-4">{course.categoryName}</td>
    <td className="py-2 px-4">${course.price}</td>
    <td className="py-2 px-4">
      <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400">
        {course.status}
      </span>
    </td>
    <td className="py-2 px-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
        onClick={() => onView(course)}
      >
        View
      </button>
    </td>
  </tr>
);


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageButtons = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
              currentPage === i 
                ? "bg-yellow-500 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === 1 
              ? "bg-yellow-500 text-white" 
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          1
        </button>
      );

      // Add dots if needed
      if (currentPage > 3) {
        pages.push(<span key="dots-1" className="px-2">...</span>);
      }

      // Add pages around current page
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(currentPage + 2, totalPages - 1); i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-4 py-2 mx-1 rounded-lg ${
              currentPage === i 
                ? "bg-yellow-500 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {i}
          </button>
        );
      }

      // Add dots if needed
      if (currentPage < totalPages - 2) {
        pages.push(<span key="dots-2" className="px-2">...</span>);
      }

      // Always show last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === totalPages 
              ? "bg-yellow-500 text-white" 
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      <div className="flex items-center">{renderPageButtons()}</div>
      
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};


// Main Component
const LockCoursesTable = () => {
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
    setSearchTerm(e.target.value.toLowerCase());
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Courses Pending Review and Approval
        </h2>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-100">
              <thead>
                <CourseTableHeader />
              </thead>
              <tbody>
                {currentCourses.map((course, index) => (
                  <CourseTableRow
                    key={course.courseId}
                    course={course}
                    index={index}
                    onView={setEditingCourse}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </motion.div>
  );
};

export default LockCoursesTable;