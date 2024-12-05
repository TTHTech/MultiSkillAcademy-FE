import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../student/content/CourseSidebar.jsx";
import MainContent from "../../student/content/MainContent.jsx";

const CourseViewer = () => {
  const [course, setCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id, progress } = useParams();
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  // Fetch course data on component mount
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

        // Calculate completed lectures based on progress
        const totalLectures = data.sections.reduce(
          (count, section) => count + section.lectures.length,
          0
        );
        const completedCount = Math.round((progress / 100) * totalLectures);

        // Mark lectures as completed or not
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

        setCourse(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id, userId, progress]);

  // Confirmation dialog when the course is not available
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

  // Update progress API call
  const updateProgress = async (lectureId) => {
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
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("Cập nhật tiến độ thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật tiến độ:", error);
    }
  };

  // Handle lecture click
  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
  };

  // Handle checkbox change and update progress
  const handleCheckboxChange = async (lecture) => {
    if (lecture.completed) return;

    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn cập nhật tiến độ tại bài học này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });
    if (!swalResult.isConfirmed) return;

    // Update lecture completion status in the local state
    setCourse((prevCourse) => {
      const updatedSections = prevCourse.sections.map((section) => ({
        ...section,
        lectures: section.lectures.map((l) =>
          l.lecture_id === lecture.lecture_id ? { ...l, completed: true } : l
        ),
      }));

      return { ...prevCourse, sections: updatedSections };
    });

    // Call the API to update progress
    await updateProgress(lecture.lecture_id);
  };

  // Calculate completed lectures for a section
  const calculateCompletedLectures = (lectures) =>
    lectures.filter((lecture) => lecture.completed).length;

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="flex h-screen">
      <Sidebar
        course={course}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        calculateCompletedLectures={calculateCompletedLectures}
        handleLectureClick={handleLectureClick}
        handleCheckboxChange={handleCheckboxChange}
      />
      <MainContent
        selectedLecture={selectedLecture}
        setSelectedLecture={setSelectedLecture}
      />
    </div>
  );
};

export default CourseViewer;
