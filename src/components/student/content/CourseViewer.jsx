import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../student/content/CourseSidebar.jsx";
import MainContent from "../../student/content/MainContent.jsx";
import { decodeId } from '../../../utils/hash';
import { encodeId } from '../../../utils/hash';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const CourseViewer = () => {
  const [course, setCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { courseHash, progressHash } = useParams();
  const id = decodeId(courseHash);
  const progress = decodeId(progressHash);

  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));
  const videoRef = React.useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  // Fetch dữ liệu khóa học khi component được mount
  useEffect(() => {
    const fetchCourseData = async () => {
      console.log("Fetching course data with progress:", progress);
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

        // Process lectures để set watched status từ backend
        data.sections.forEach((section) => {
          section.lectures.forEach((lecture) => {
            // Backend đã gửi watched status, giữ nguyên
            lecture.watched = lecture.watched || false;
          });
        });

        setCourse(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id, userId, progress]);

  // Tự động chọn video khi course data loaded
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
      
      // Nếu không có bài giảng đã lưu, tìm bài đầu tiên chưa hoàn thành
      for (const section of course.sections) {
        for (const lecture of section.lectures) {
          if (!lecture.watched) {
            setSelectedLecture(lecture);
            return;
          }
        }
      }
      
      // Nếu tất cả đã hoàn thành, chọn bài đầu tiên
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

  // Sửa lại hàm updateProgress để refresh realtime
  const updateProgress = async (lectureId, progressPercent = 100) => {
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
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      console.log("Updated progress successfully for lecture:", lectureId);
      
      // Cập nhật state local ngay lập tức
      setCourse((prevCourse) => {
        if (!prevCourse) return prevCourse;
        
        const updatedCourse = { ...prevCourse };
        updatedCourse.sections = updatedCourse.sections.map((section) => {
          const updatedSection = { ...section };
          updatedSection.lectures = section.lectures.map((lecture) => {
            if (lecture.lecture_id === lectureId) {
              return { ...lecture, watched: true };
            }
            return lecture;
          });
          return updatedSection;
        });
        
        return updatedCourse;
      });
      
      // Trigger re-render để update lock status
      setSelectedLecture(prev => ({ ...prev }));
      
    } catch (error) {
      console.error("Lỗi khi cập nhật tiến độ:", error);
    }
  };

  // Thêm useEffect để check lock status khi course data thay đổi
  useEffect(() => {
    if (selectedLecture && course) {
      // Trigger re-render MainContent để check lock status
      setSelectedLecture(prev => ({ ...prev }));
    }
  }, [course]);

  // Fetch updated course data
  const fetchUpdatedCourseData = async () => {
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
      
      if (response.ok) {
        const data = await response.json();
        
        // Keep current selected lecture
        const currentLectureId = selectedLecture?.lecture_id;
        
        // Update course data
        setCourse(data);
        
        // Restore selected lecture if it exists
        if (currentLectureId) {
          const allLectures = data.sections.flatMap(section => section.lectures);
          const currentLecture = allLectures.find(
            lecture => lecture.lecture_id === currentLectureId
          );
          if (currentLecture) {
            setSelectedLecture(currentLecture);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching updated course data:", error);
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
    
    // Save current lecture ID
    localStorage.setItem("current_lecture_id", lecture.lecture_id);
    
    // Clear current lecture first to force re-render
    setSelectedLecture(null);
    
    // Set new lecture after a small delay
    setTimeout(() => {
      setSelectedLecture(lecture);
    }, 50);
  };

  // Xử lý khi người dùng thay đổi trạng thái checkbox
  const handleCheckboxChange = async (lecture) => {
    if (lecture.watched) return;

    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn đánh dấu bài học này là đã hoàn thành?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });
    
    if (!swalResult.isConfirmed) return;

    // Cập nhật tiến độ
    await updateProgress(lecture.lecture_id);
  };

  // Tính số bài học đã hoàn thành trong một phần
  const calculateCompletedLectures = (lectures) =>
    lectures.filter((lecture) => lecture.watched === true).length;

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

  if (!course) return null;

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
          setIsHoveringButton={setIsHoveringButton}
          isHoveringButton={isHoveringButton}
          course={course} // Thêm dòng này
        />
      </div>

      {/* Sidebar - Fixed position */}
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

export default CourseViewer;