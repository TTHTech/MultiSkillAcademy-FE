import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionsAndAnswers from "../../../pages/student/courses/QuestionAndAnswers";
import Swal from "sweetalert2";

const CourseViewer = () => {
  const [course, setCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id, progress } = useParams(); // Course ID và progress
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId")); // Lấy userId từ localStorage

  // Fetch thông tin khóa học
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

        // Áp dụng trạng thái hoàn thành từ progress
        const completedLectures = new Set(progress?.split(",").map(Number)); // progress là chuỗi các ID bài học đã hoàn thành
        data.sections.forEach((section) => {
          section.lectures.forEach((lecture) => {
            lecture.completed = completedLectures.has(lecture.lecture_id);
            lecture.locked = lecture.completed; // Khóa bài học nếu đã hoàn thành
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

  // Hiển thị thông báo nếu khóa học chưa đăng ký
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

  // Nếu không có dữ liệu khóa học, hiển thị thông báo
  useEffect(() => {
    if (!isLoading && course === null) handleConfirmation();
  }, [isLoading, course, id]);

  // Hàm cập nhật tiến độ bài giảng
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

  // Xử lý sự kiện tích chọn checkbox bài giảng
  const handleCheckboxChange = (lecture) => {
    if (lecture.locked) return; // Không cho phép thay đổi nếu đã khóa
    lecture.completed = true; // Đánh dấu hoàn thành
    lecture.locked = true; // Khóa bài học
    setCourse({ ...course }); // Cập nhật lại state
    updateProgress(lecture.lecture_id); // Gọi API để cập nhật tiến độ
  };

  // Tính số lượng bài học đã hoàn thành
  const calculateCompletedLectures = (lectures) =>
    lectures.filter((lecture) => lecture.completed).length;

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
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r overflow-y-auto">
        <div className="mb-6">
          <img
            src={course.images[0]}
            alt={course.title}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
        </div>
        <div>
          {course.sections.map((section) => (
            <div key={section.section_id} className="mb-6">
              <h2
                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 flex justify-between items-center"
                onClick={() => setSelectedSection(selectedSection === section ? null : section)}
              >
                {section.title}
                <span className="text-sm text-gray-500">
                  {calculateCompletedLectures(section.lectures)}/
                  {section.lectures.length}
                </span>
              </h2>
              {selectedSection === section && (
                <ul className="mt-2 space-y-2 pl-4">
                  {section.lectures.map((lecture) => (
                    <li
                      key={lecture.lecture_id}
                      className={`p-2 rounded-lg ${
                        lecture.locked ? "bg-green-100" : "bg-gray-50"
                      } hover:bg-gray-200 cursor-pointer flex justify-between items-center`}
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={lecture.completed}
                          className="mr-2"
                          disabled={lecture.locked}
                          onChange={() => handleCheckboxChange(lecture)}
                        />
                        {lecture.title}
                      </div>
                      <span className="text-sm text-gray-500">{lecture.duration}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6 bg-white overflow-y-auto">
        {selectedLecture ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedLecture.title}</h2>
            {selectedLecture.content_type.toLowerCase() === "video" &&
              selectedLecture.video_url && (
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <video controls className="w-full h-full">
                    <source src={selectedLecture.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            {selectedLecture.content_type.toLowerCase() === "pdf" &&
              selectedLecture.document_url && (
                <iframe
                  src={selectedLecture.document_url}
                  className="w-full h-[500px] border"
                  title={selectedLecture.title}
                />
              )}
            <p className="text-gray-600 mt-2">
              Thời lượng: {selectedLecture.duration} phút
            </p>
            <button
              onClick={() => setSelectedLecture(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Quay lại danh sách bài giảng
            </button>
          </div>
        ) : (
          <QuestionsAndAnswers courseId={id} />
        )}
      </div>
    </div>
  );
};

export default CourseViewer;