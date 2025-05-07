import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../student/content/CourseSidebar.jsx";
import MainContent from "../../student/content/MainContent.jsx";
import { decodeId } from '../../../utils/hash';
import { encodeId } from '../../../utils/hash';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const CourseViewer = () => {
  const [course, setCourse] = useState(null); // Dữ liệu khóa học
  const [selectedSection, setSelectedSection] = useState(null); // Phần được chọn
  const [selectedLecture, setSelectedLecture] = useState(null); // Bài học được chọn
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const { courseHash, progressHash } = useParams(); // Lấy id và tiến độ từ URL
  const id = decodeId(courseHash);
  const progress = decodeId(progressHash);

  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId")); // Lấy userId từ localStorage
  const videoRef = React.useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  // Fetch dữ liệu khóa học khi component được mount
  useEffect(() => {
    const fetchCourseData = async () => {
      console.log(progress)
      try {
        const response = await fetch(
          `${baseUrl}/api/student/study-courses/${id}/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        // Tính số bài học hoàn thành dựa trên tiến độ
        const totalLectures = data.sections.reduce(
          (count, section) => count + section.lectures.length,
          0
        );
        const completedCount = Math.round((progress / 100) * totalLectures);

        // Đánh dấu bài học đã hoàn thành hoặc chưa
        let completedSoFar = 0;
        data.sections.forEach((section) => {
          section.lectures.forEach((lecture) => {
            if (completedSoFar < completedCount) {
              lecture.completed = true;
              completedSoFar++;
            } else {
              lecture.completed = false;
            }
          });
        });

        setCourse(data); // Lưu dữ liệu khóa học vào state
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false); // Dừng trạng thái loading
      }
    };

    fetchCourseData();
  }, [id, userId, progress]);

  // Thêm useEffect để tự động chọn video
  useEffect(() => {
    if (course && !selectedLecture) {
      // Lấy lecture_id từ localStorage
      const savedLectureId = localStorage.getItem("current_lecture_id");
      
      if (savedLectureId) {
        // Tìm bài giảng đã lưu
        const allLectures = course.sections.flatMap(section => section.lectures);
        const savedLecture = allLectures.find(
          lecture => lecture.lecture_id === parseInt(savedLectureId)
        );
        
        if (savedLecture) {
          setSelectedLecture(savedLecture);
          return;
        }
      }
      
      // Nếu không có bài giảng đã lưu hoặc không tìm thấy, lấy bài đầu tiên
      if (course.sections.length > 0 && course.sections[0].lectures.length > 0) {
        setSelectedLecture(course.sections[0].lectures[0]);
      }
    }
  }, [course, selectedLecture]);

  // Hiển thị xác nhận nếu khóa học không khả dụng
  const handleConfirmation = async () => {
    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn chưa đăng ký khóa học này. Bạn có muốn chuyển đến xem khóa học không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });
    if (swalResult.isConfirmed) navigate(`/course/${encodeId(id)}`);
  };

  useEffect(() => {
    if (!isLoading && course === null) handleConfirmation();
  }, [isLoading, course, id]);

  // Cập nhật tiến độ qua API
  const updateProgress = async (lectureId, progress) => {
    try {
      const response = await fetch(`${baseUrl}/api/student/update-progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          courseId: id,
          lectureId,
          progress, // Gửi tiến độ hiện tại
        }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("Cập nhật tiến độ thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật tiến độ:", error);
    }
  };
  
  // Xử lý khi người dùng chọn bài học
  const handleLectureClick = (lecture) => {
    // Validate lecture data
    if (!lecture || !lecture.lecture_id) {
      console.error("Invalid lecture data:", lecture);
      return;
    }
    
    console.log("Changing to lecture:", lecture.lecture_id, lecture.title);
    
    // Set loading state if needed
    // setIsLoading(true);
    
    // Update selected lecture
    setSelectedLecture(null); // Clear current lecture first
    
    // Use setTimeout to ensure React has time to process the state change
    setTimeout(() => {
      setSelectedLecture(lecture);
      // setIsLoading(false);
    }, 50);
  };

  // Xử lý khi người dùng thay đổi trạng thái checkbox
  const handleCheckboxChange = async (lecture) => {
    if (lecture.completed) return; // Nếu đã hoàn thành, không làm gì

    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn cập nhật tiến độ tại bài học này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });
    if (!swalResult.isConfirmed) return;

    // Cập nhật trạng thái hoàn thành trong state cục bộ
    setCourse((prevCourse) => {
      const updatedSections = prevCourse.sections.map((section) => ({
        ...section,
        lectures: section.lectures.map((l) =>
          l.lecture_id === lecture.lecture_id ? { ...l, completed: true } : l
        ),
      }));

      return { ...prevCourse, sections: updatedSections };
    });

    // Gọi API để cập nhật tiến độ
    await updateProgress(lecture.lecture_id);
  };

  // Tính số bài học đã hoàn thành trong một phần
  const calculateCompletedLectures = (lectures) =>
    lectures.filter((lecture) => lecture.completed).length;

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (!course) return null; // Nếu không có dữ liệu khóa học, không hiển thị gì

  return (
    <div className="flex flex-col h-full relative">
      {/* Main content wrapper with conditional padding for sidebar */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ${isSidebarOpen ? 'pr-[380px]' : ''}`}>
        <MainContent
          selectedLecture={selectedLecture}
          setSelectedLecture={setSelectedLecture}
          lectures={course?.sections?.flatMap(section => section.lectures) || []}
          updateProgress={updateProgress}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* Sidebar - Fixed position but will not overlap footer */}
      {isSidebarOpen && (
        <div className="fixed top-[90px] right-0 w-[380px] bg-white border-l border-gray-200 shadow-xl z-30"
             style={{ 
               height: "calc(100vh - 90px)",
               overflowY: "auto",
               overflowX: "hidden"
             }}>
          <Sidebar
            course={course}
            calculateCompletedLectures={calculateCompletedLectures}
            handleLectureClick={handleLectureClick}
            selectedLecture={selectedLecture}
            progressCourses={progress}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

// Component mới để xử lý việc tự động ẩn sidebar khi footer xuất hiện
const StickyWithoutOverlap = ({ content, isOpen, onClose }) => {
  const [sidebarHeight, setSidebarHeight] = useState("calc(100vh - 90px)");
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;
      
      const footerElement = document.querySelector("footer");
      if (!footerElement) return;

      const footerRect = footerElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Khi footer bắt đầu xuất hiện trong viewport
      if (footerRect.top < windowHeight) {
        // Tính toán chiều cao mới cho sidebar
        const newHeight = footerRect.top - 90; // 90px là chiều cao của navbar
        setSidebarHeight(`${newHeight}px`);
      } else {
        // Reset về chiều cao mặc định
        setSidebarHeight("calc(100vh - 90px)");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Gọi ngay lúc đầu để set giá trị ban đầu

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <div 
      ref={sidebarRef}
      className="fixed top-[90px] right-0 w-[380px] bg-white border-l border-gray-200 shadow-xl overflow-auto z-30"
      style={{ height: sidebarHeight, transition: "height 0.3s" }}
    >
      {content}
    </div>
  );
};

export default CourseViewer;