import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../student/content/CourseSidebar.jsx";
import MainContent from "../../student/content/MainContent.jsx";

const CourseViewer = () => {
  const [course, setCourse] = useState(null); // Dữ liệu khóa học
  const [selectedSection, setSelectedSection] = useState(null); // Phần được chọn
  const [selectedLecture, setSelectedLecture] = useState(null); // Bài học được chọn
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const { id, progress } = useParams(); // Lấy id và tiến độ từ URL
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId")); // Lấy userId từ localStorage

  // Fetch dữ liệu khóa học khi component được mount
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/student/study-courses/${id}/${userId}`,
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
    if (swalResult.isConfirmed) navigate(`/course/${id}`);
  };

  useEffect(() => {
    if (!isLoading && course === null) handleConfirmation();
  }, [isLoading, course, id]);

  // Cập nhật tiến độ qua API
  const updateProgress = async (lectureId, progress) => {
    try {
      const response = await fetch("http://localhost:8080/api/student/update-progress", {
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
    console.log("Selected Lecture:", lecture); // Debug bài học được chọn
    setSelectedLecture(lecture);
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
    <div className="flex h-screen">
      {/* Sidebar hiển thị các phần và bài học */}
      <Sidebar
        course={course}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        calculateCompletedLectures={calculateCompletedLectures}
        handleLectureClick={handleLectureClick}
        handleCheckboxChange={handleCheckboxChange}
        selectedLecture={selectedLecture}
        id={id} 
      />
      {/* MainContent hiển thị nội dung bài học */}
      <MainContent
        selectedLecture={selectedLecture}
        setSelectedLecture={setSelectedLecture}
        lectures={course.sections.flatMap((section) => section.lectures)}
        updateProgress={updateProgress} // Truyền đúng hàm
      />
    </div>
  );
};

export default CourseViewer;