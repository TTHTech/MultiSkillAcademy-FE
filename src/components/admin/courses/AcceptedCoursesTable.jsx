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
import { FaUserCircle, FaBook, FaTools, FaClipboardList, FaChevronLeft, FaChevronRight, FaArrowLeft } from "react-icons/fa";

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
      className="w-full h-[450px] rounded-lg overflow-hidden 
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
              alt={`Course Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
  </div>
);

// MessagePopup Component with refined UI
const MessagePopup = ({ messageContent, setMessageContent, onSend, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
    <div className="bg-slate-800 p-7 rounded-lg w-full max-w-lg shadow-xl border border-slate-700/50 animate-scaleIn">
      <h3 className="text-lg font-medium text-slate-100 mb-4 flex items-center">
        <span className="w-1 h-5 bg-slate-500 rounded-r mr-3"></span>
        Course Deactivation Message
      </h3>
      <p className="mb-5 text-slate-300 text-sm">
        Please provide a detailed explanation for why this course is being deactivated. This message will be sent to the instructor.
      </p>
      <textarea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        className="w-full p-3 bg-slate-700/70 text-slate-200 rounded-md mb-5 border border-slate-600/50 focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 transition-all"
        rows="4"
        placeholder="Enter your message here..."
      />
      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-all"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-md bg-slate-500 hover:bg-slate-400 text-white font-medium transition-all"
          onClick={onSend}
        >
          Send & Deactivate
        </button>
      </div>
    </div>
  </div>
);

// SearchBar Component with refined design
const SearchBar = ({ searchTerm, onSearch }) => (
  <div className="relative w-64">
    <input
      type="text"
      placeholder="Search courses..."
      className="w-full bg-slate-800/80 text-slate-200 placeholder-slate-400 rounded-md pl-9 pr-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-slate-500/40 focus:border-slate-600 transition-all"
      onChange={onSearch}
      value={searchTerm}
    />
    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
  </div>
);

// DetailField Component with refined UI
const DetailField = ({ label, value, isTextArea = false }) => (
  <div className="mb-5 bg-slate-800/30 rounded-md p-3 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 group border border-slate-700/20">
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
        name={label.toLowerCase()}
        value={value}
        className="w-full p-2.5 bg-slate-700/30 text-slate-200 rounded-md border border-slate-600/30 focus:border-slate-500 focus:ring-1 focus:ring-slate-500/10 transition-all font-light text-sm"
        readOnly
      />
    )}
  </div>
);

// ListField Component with refined UI
const ListField = ({ label, items, icon: Icon }) => (
  <div className="mb-5 bg-slate-800/30 rounded-md p-3 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 border border-slate-700/20">
    <label className="block text-xs font-medium text-slate-400 mb-2">
      {label}
    </label>
    <ul className="space-y-2">
      {items?.map((item, idx) => (
        <li 
          key={idx} 
          className="flex items-center gap-2.5 p-2.5 bg-slate-700/30 rounded-md hover:bg-slate-700/50 transition-colors group"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-600/50 group-hover:bg-slate-500/50 transition-colors">
            <Icon className="text-slate-300 group-hover:text-white transition-colors" size={14} />
          </div>
          <span className="flex-1 text-slate-300 text-xs">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// CourseTable Component with refined UI
const CourseTable = ({ courses, onView }) => (
  <div className="overflow-hidden rounded-md border border-slate-700/40 backdrop-blur-sm">
    <table className="w-full text-left text-slate-200">
      <thead>
        <tr className="bg-gradient-to-r from-slate-800/90 to-slate-800/70">
          <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">ID</th>
          <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Name</th>
          <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Duration</th>
          <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Category</th>
          <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Price</th>
          <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Status</th>
          <th className="py-3 px-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Actions</th>
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
            <td className="py-3 px-4 font-medium text-teal-300 text-sm">${course.price}</td>
            <td className="py-3 px-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                course.status === 'Active' 
                  ? 'bg-teal-900/20 text-teal-300 border border-teal-800/30' 
                  : 'bg-amber-900/20 text-amber-300 border border-amber-800/30'
              }`}>
                {course.status}
              </span>
            </td>
            <td className="py-3 px-4">
              <button
                onClick={() => onView(course)}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-600/90 hover:bg-slate-500 text-white transition-all duration-200 font-medium text-xs"
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

// CourseDetails Component with refined UI
const CourseDetails = ({ course, onClock, onCancel }) => (
  <div className="bg-slate-800/30 rounded-md p-6 backdrop-blur-sm border border-slate-700/30 animate-fadeIn">
    <div className="flex items-center mb-5">
      <button
        onClick={onCancel}
        className="mr-3 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
      >
        <FaArrowLeft size={14} />
      </button>
      <h3 className="text-xl font-medium text-slate-200">Course Details</h3>
    </div>
    
    <ImageGallery images={course.imageUrls} />
    
    <div className="flex items-center mb-6">
      <div className="w-1 h-6 bg-slate-500 rounded-r mr-3" />
      <h3 className="text-lg font-medium text-slate-200">Course Information</h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      <div className="space-y-5">
        <DetailField label="Course Name" value={course.title} />
        <DetailField 
          label="Instructor" 
          value={`${course.instructorFirstName} ${course.instructorLastName}`} 
        />
        <DetailField label="Category" value={course.categoryName} />
        <DetailField label="Price" value={`$${course.price}`} />
      </div>
      
      <div className="space-y-5">
        <DetailField label="Duration" value={course.duration} />
        <DetailField label="Language" value={course.language} />
        <DetailField label="Rating" value={course.rating} />
        <DetailField label="Level" value={course.level} />
      </div>
    </div>

    <div className="mb-6">
      <DetailField label="Description" value={course.description} isTextArea />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
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

    <div className="flex gap-3 pt-4 border-t border-slate-700/30">
      <button
        onClick={onClock}
        className="flex-1 px-4 py-2.5 rounded-md bg-slate-600 hover:bg-slate-500 text-white font-medium transition-all transform hover:scale-101 flex items-center justify-center"
      >
        Deactivate Course
      </button>
      <button
        onClick={onCancel}
        className="flex-1 px-4 py-2.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-all transform hover:scale-101"
      >
        Back to Courses
      </button>
    </div>
  </div>
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
        <span className="text-sm">Previous</span>
      </button>

      <div className="flex items-center">{renderPageNumbers()}</div>

      <button
        className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <span className="text-sm">Next</span>
        <FaChevronRight size={12} />
      </button>
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

// Main AcceptedCoursesTable Component
const ITEMS_PER_PAGE = 10;

const AcceptedCoursesTable = () => {
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
    const term = e.target.value;
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

      toast.success("Course deactivated successfully!");
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
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-400"></div>
          <p className="mt-4 text-slate-400 text-sm">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/10 border border-red-900/30 text-red-300 rounded-md p-4">
        <h3 className="font-medium text-base mb-1">Error</h3>
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
            Approved Courses
          </h2>
        </div>
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
              <p className="text-slate-400 text-sm">No courses match your search criteria.</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AcceptedCoursesTable;