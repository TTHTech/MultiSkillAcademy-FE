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
import { FaUserCircle, FaBook, FaTools, FaClipboardList } from "react-icons/fa";

// ImageGallery Component
const ImageGallery = ({ images }) => (
  <div className="relative group flex justify-center mb-6">
    <Swiper
      modules={[Navigation, SwiperPagination]}
      spaceBetween={10}
      slidesPerView={1}
      loop={true}
      navigation={true}
      pagination={{ clickable: true }}
      className="w-full h-[500px] rounded-xl overflow-hidden [&_.swiper-button-next]:text-white [&_.swiper-button-next]:opacity-0 [&_.swiper-button-next]:group-hover:opacity-100 [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:opacity-0 [&_.swiper-button-prev]:group-hover:opacity-100 [&_.swiper-pagination-bullet]:bg-white"
    >
      {images?.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full overflow-hidden">
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

// DetailField Component 
const DetailField = ({ label, value, isTextArea = false, className = "" }) => (
  <div className={`rounded-lg overflow-hidden ${className}`}>
    <label className="block text-sm font-medium text-gray-400 px-4 pt-2">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        value={value}
        className="w-full p-4 bg-transparent text-white focus:outline-none min-h-[120px]"
        readOnly
      />
    ) : (
      <input
        type="text"
        value={value}
        className="w-full p-4 bg-transparent text-white focus:outline-none"
        readOnly
      />
    )}
  </div>
);

// SearchBar Component
const SearchBar = ({ searchTerm, onSearch }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search courses..."
      className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={onSearch}
      value={searchTerm}
    />
    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
  </div>
);

// CourseTable Component
const CourseTable = ({ courses, onView }) => (
  <table className="table-auto w-full text-left text-gray-100">
    <thead>
      <tr className="border-b bg-gray-700">
        <th className="py-2 px-4">ID</th>
        <th className="py-2 px-4">Name</th>
        <th className="py-2 px-4">Duration</th>
        <th className="py-2 px-4">Category</th>
        <th className="py-2 px-4">Price</th>
        <th className="py-2 px-4">Status</th>
        <th className="py-2 px-4">Actions</th>
      </tr>
    </thead>
    <tbody>
      {courses.map((course, index) => (
        <tr key={course.id} className="border-b bg-gray-800 hover:bg-gray-700 transition-colors">
          <td className="py-2 px-4">{index + 1}</td>
          <td className="py-2 px-4">{course.title}</td>
          <td className="py-2 px-4">{course.duration}</td>
          <td className="py-2 px-4">{course.categoryName}</td>
          <td className="py-2 px-4">${course.price}</td>
          <td className="py-2 px-4 text-yellow-500">{course.status}</td>
          <td className="py-2 px-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
              onClick={() => onView(course)}
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);


// CourseInfo Component
const CourseInfo = ({ course }) => (
  <div className="bg-gray-800 rounded-xl p-6 mb-6">
    <div className="flex items-center mb-6">
      <div className="w-1 bg-blue-500 h-8 mr-3"></div>
      <h3 className="text-xl font-semibold text-gray-100">Course Details</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Basic Info */}
      <div className="space-y-4">
        <DetailField 
          label="Name" 
          value={course.title} 
          className="bg-gray-700 border-l-4 border-blue-500"
        />
        <DetailField 
          label="Instructor" 
          value={`${course.instructorFirstName} ${course.instructorLastName}`}
          className="bg-gray-700 border-l-4 border-green-500"
        />
        <DetailField 
          label="Category" 
          value={course.categoryName}
          className="bg-gray-700 border-l-4 border-purple-500"
        />
        <DetailField 
          label="Price" 
          value={`$${course.price}`}
          className="bg-gray-700 border-l-4 border-yellow-500"
        />
      </div>

      {/* Right Column - Additional Info */}
      <div className="space-y-4">
        <DetailField 
          label="Duration" 
          value={course.duration}
          className="bg-gray-700 border-l-4 border-red-500"
        />
        <DetailField 
          label="Language" 
          value={course.language}
          className="bg-gray-700 border-l-4 border-indigo-500"
        />
        <DetailField 
          label="Rating" 
          value={course.rating}
          className="bg-gray-700 border-l-4 border-pink-500"
        />
        <DetailField 
          label="Level" 
          value={course.level}
          className="bg-gray-700 border-l-4 border-orange-500"
        />
      </div>

      {/* Full Width Description */}
      <div className="col-span-1 md:col-span-2">
        <DetailField 
          label="Description" 
          value={course.description} 
          isTextArea 
          className="bg-gray-700 border-l-4 border-teal-500"
        />
      </div>
    </div>
  </div>
);

// MetadataSection Component for grouping related metadata
const MetadataSection = ({ label, items, icon: Icon, borderColor, iconColor }) => (
  <div className={`mb-6 bg-gray-700 rounded-lg p-4 border-l-4 ${borderColor}`}>
    <h4 className="text-lg font-medium text-gray-100 mb-4 flex items-center">
      <Icon className={`mr-2 ${iconColor}`} size={20} />
      {label}
    </h4>
    <ul className="space-y-3">
      {items?.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors">
          <div className={`mt-1 w-2 h-2 rounded-full ${iconColor.replace('text-', 'bg-')}`} />
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// CourseMetadata Component
const CourseMetadata = ({ course }) => (
  <div className="bg-gray-800 rounded-xl p-6">
    <div className="flex items-center mb-6">
      <div className="w-1 bg-purple-500 h-8 mr-3"></div>
      <h3 className="text-xl font-semibold text-gray-100">Course Information</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div>
        <MetadataSection
          label="Target Audience"
          items={course.targetAudience}
          icon={FaUserCircle}
          borderColor="border-blue-500"
          iconColor="text-blue-500"
        />
        <MetadataSection
          label="Requirements"
          items={course.requirements}
          icon={FaClipboardList}
          borderColor="border-green-500"
          iconColor="text-green-500"
        />
      </div>

      {/* Right Column */}
      <div>
        <MetadataSection
          label="Course Content"
          items={course.courseContent}
          icon={FaBook}
          borderColor="border-yellow-500"
          iconColor="text-yellow-500"
        />
        <MetadataSection
          label="Resources"
          items={course.resourceDescription}
          icon={FaTools}
          borderColor="border-pink-500"
          iconColor="text-pink-500"
        />
      </div>
    </div>
  </div>
);

// ActionButtons Component
const ActionButtons = ({ courseId, onAccept, onReject, onCancel }) => (
  <div className="flex gap-4 mt-6">
    <button
      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      onClick={() => onAccept(courseId)}
    >
      <span>Accept</span>
    </button>
    <button
      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      onClick={() => onReject(courseId)}
    >
      <span>Reject</span>
    </button>
    <button
      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      onClick={onCancel}
    >
      <span>Cancel</span>
    </button>
  </div>
);

// CourseDetailView Component
const CourseDetailView = ({ course, onAccept, onReject, onCancel }) => {
  const { courseId } = course;
  
  return (
    <div className="bg-gray-900 p-6 rounded-xl">
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

// PageButton Component
const PageButton = ({ page, currentPage, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
      currentPage === page 
        ? "bg-yellow-500 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
    }`}
  >
    {page}
  </button>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 13) {
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
      if (currentPage <= 10) {
        // First 10 pages
        for (let i = 1; i <= 10; i++) {
          pages.push(
            <PageButton
              key={i}
              page={i}
              currentPage={currentPage}
              onClick={() => onPageChange(i)}
            />
          );
        }
        pages.push(<span key="dots-end" className="px-4 py-2">...</span>);
        // Last 3 pages
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(
            <PageButton
              key={i}
              page={i}
              currentPage={currentPage}
              onClick={() => onPageChange(i)}
            />
          );
        }
      } else if (currentPage > 10 && currentPage <= totalPages - 10) {
        // Middle section
        pages.push(
          <PageButton
            key={1}
            page={1}
            currentPage={currentPage}
            onClick={() => onPageChange(1)}
          />
        );
        pages.push(<span key="dots-start" className="px-4 py-2">...</span>);

        for (let i = currentPage - 4; i <= currentPage + 4; i++) {
          pages.push(
            <PageButton
              key={i}
              page={i}
              currentPage={currentPage}
              onClick={() => onPageChange(i)}
            />
          );
        }

        pages.push(<span key="dots-end" className="px-4 py-2">...</span>);
        for (let i = totalPages - 2; i <= totalPages; i++) {
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
        // Last section
        pages.push(
          <PageButton
            key={1}
            page={1}
            currentPage={currentPage}
            onClick={() => onPageChange(1)}
          />
        );
        pages.push(<span key="dots-start" className="px-4 py-2">...</span>);

        for (let i = totalPages - 12; i <= totalPages; i++) {
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
    <div className="flex justify-between mt-6">
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <div className="flex items-center">{renderPageNumbers()}</div>

      <button
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

// Main CoursesTable Component
const ITEMS_PER_PAGE = 10;

const CoursesTable = () => {
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
        "http://localhost:8080/api/admin/courses/pending",
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
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const updateCourseStatus = async (courseId, status) => {
    if (!courseId) {
      console.error("Course ID is undefined");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/courses/${courseId}/status`,
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
        throw new Error(`Failed to ${status.toLowerCase()} course.`);
      }

      toast.success(`Course ${status.toLowerCase()}ed successfully!`);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === courseId ? { ...course, status } : course
        )
      );
      setEditingCourse(null);
    } catch (error) {
      console.error(`Error updating course status:`, error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleAccept = (courseId) => updateCourseStatus(courseId, "Active");
  const handleReject = (courseId) => updateCourseStatus(courseId, "Declined");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 rounded-xl p-4">
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
        <CourseTable
          courses={currentCourses}
          onView={setEditingCourse}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
};

export default CoursesTable;