// AcceptedCoursesComponents.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaUserCircle, FaBook, FaTools, FaClipboardList } from "react-icons/fa";

// ImageGallery Component
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

// MessagePopup Component
const MessagePopup = ({ messageContent, setMessageContent, onSend, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg w-1/3">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">
        Enter message for deletion
      </h3>
      <textarea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        className="w-full p-2 bg-gray-600 text-white rounded-lg mb-4"
        rows="4"
        placeholder="Enter your message here..."
      />
      <div className="flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 transition-colors"
          onClick={onSend}
        >
          Send
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
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


// DetailField Component with improved UI
const DetailField = ({ label, value, isTextArea = false }) => (
  <div className="mb-6 bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group">
    <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-gray-200 transition-colors">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        value={value}
        className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[120px]"
        readOnly
      />
    ) : (
      <input
        type="text"
        name={label.toLowerCase()}
        value={value}
        className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        readOnly
      />
    )}
  </div>
);

// ListField Component with improved UI
const ListField = ({ label, items, icon: Icon }) => (
  <div className="mb-6 bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
    <label className="block text-sm font-medium text-gray-400 mb-3">
      {label}
    </label>
    <ul className="space-y-3">
      {items?.map((item, idx) => (
        <li 
          key={idx} 
          className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 group-hover:bg-gray-500 transition-colors">
            <Icon className="text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
          <span className="flex-1 text-gray-200">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// CourseTable Component with improved UI
const CourseTable = ({ courses, onView }) => (
  <div className="overflow-hidden rounded-xl border border-gray-700/50 backdrop-blur-sm">
    <table className="w-full text-left text-gray-100">
      <thead>
        <tr className="bg-gray-800/70">
          <th className="py-4 px-6 font-medium">ID</th>
          <th className="py-4 px-6 font-medium">Name</th>
          <th className="py-4 px-6 font-medium">Duration</th>
          <th className="py-4 px-6 font-medium">Category</th>
          <th className="py-4 px-6 font-medium">Price</th>
          <th className="py-4 px-6 font-medium">Status</th>
          <th className="py-4 px-6 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700/50">
        {courses.map((course, index) => (
          <tr 
            key={course.id} 
            className="bg-gray-800/40 hover:bg-gray-700/60 transition-colors duration-200"
          >
            <td className="py-4 px-6">{index + 1}</td>
            <td className="py-4 px-6 font-medium">{course.title}</td>
            <td className="py-4 px-6">{course.duration}</td>
            <td className="py-4 px-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50">
                {course.categoryName}
              </span>
            </td>
            <td className="py-4 px-6 font-medium text-green-400">${course.price}</td>
            <td className="py-4 px-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                course.status === 'Active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {course.status}
              </span>
            </td>
            <td className="py-4 px-6">
              <button
                onClick={() => onView(course)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-500 text-white transition-colors duration-200 font-medium text-sm"
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// CourseDetails Component with improved UI
const CourseDetails = ({ course, onClock, onCancel }) => (
  <div className="bg-gray-800/50 rounded-xl p-6 shadow-xl backdrop-blur-sm border border-gray-700/50">
    <ImageGallery images={course.imageUrls} />
    
    <div className="flex items-center mb-8">
      <div className="w-1 h-8 bg-blue-500 rounded-r mr-4" />
      <h3 className="text-2xl font-semibold text-white">Course Details</h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="space-y-6">
        <DetailField label="Name" value={course.title} />
        <DetailField 
          label="Instructor" 
          value={`${course.instructorFirstName} ${course.instructorLastName}`} 
        />
        <DetailField label="Category" value={course.categoryName} />
        <DetailField label="Price" value={`$${course.price}`} />
      </div>
      
      <div className="space-y-6">
        <DetailField label="Duration" value={course.duration} />
        <DetailField label="Language" value={course.language} />
        <DetailField label="Rating" value={course.rating} />
        <DetailField label="Level" value={course.level} />
      </div>
    </div>

    <div className="mb-8">
      <DetailField label="Description" value={course.description} isTextArea />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <ListField
          label="Target Audience"
          items={course.targetAudience}
          icon={FaUserCircle}
        />
        <ListField
          label="Course Content"
          items={course.courseContent}
          icon={FaBook}
        />
      </div>
      <div>
        <ListField
          label="Resources"
          items={course.resourceDescription}
          icon={FaTools}
        />
        <ListField
          label="Requirements"
          items={course.requirements}
          icon={FaClipboardList}
        />
      </div>
    </div>

    <div className="flex gap-4">
      <button
        onClick={onClock}
        className="flex-1 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all transform hover:scale-105 hover:shadow-lg shadow-md"
      >
        Clock Course
      </button>
      <button
        onClick={onCancel}
        className="flex-1 px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all transform hover:scale-105 hover:shadow-lg shadow-md"
      >
        Cancel
      </button>
    </div>
  </div>
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
    <div className="flex justify-between mt-4">
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <div className="flex items-center">{renderPageNumbers()}</div>

      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
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

// Main AcceptedCoursesTable Component
const ITEMS_PER_PAGE = 10;

const AcceptedCoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/courses/active",
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

  const handleClockClick = () => {
    if (!editingCourse?.courseId) {
      console.error("Course ID is undefined");
      return;
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setMessageContent("");
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/emails/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            courseId: editingCourse.courseId,
            messageContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email.");
      }

      toast.success("Email sent successfully!");
      await handleReject(editingCourse.courseId);
      closePopup();
    } catch (error) {
      console.error("Error sending email or updating course:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleReject = async (courseId) => {
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
          body: JSON.stringify({ status: "Inactive" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course status.");
      }

      toast.success("Course inactivated successfully!");
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === courseId
            ? { ...course, status: "Inactive" }
            : course
        )
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
          Accepted Courses
        </h2>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearch={handleSearch} 
        />
      </div>

      {editingCourse ? (
        <>
          <CourseDetails
            course={editingCourse}
            onClock={handleClockClick}
            onCancel={() => setEditingCourse(null)}
          />
          {showPopup && (
            <MessagePopup
              messageContent={messageContent}
              setMessageContent={setMessageContent}
              onSend={handleSendMessage}
              onClose={closePopup}
            />
          )}
        </>
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

export default AcceptedCoursesTable;