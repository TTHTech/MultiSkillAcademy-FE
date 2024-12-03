import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionsAndAnswers from "./QuestionAndAnswers";
import NavBar from "../../../components/student/common/NavBar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CourseViewer = () => {
  const [course, setCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { id } = useParams();
  const userId = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 

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
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCourse(data);
        
      } catch (error) {
        console.error("Error fetching course data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCourseData();
  }, [id, userId]);

  const handleConfirmation = async () => {
    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn chưa đăng ký khóa học này. Bạn có muốn chuyển đến xem khóa học không ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });

    if (swalResult.isConfirmed) {
      navigate(`/course/${id}`); 
    } else {
      console.log("Người dùng hủy thao tác");
    }
  };
  useEffect(() => {
    if (!isLoading && course === null) {
      handleConfirmation();
    }
  }, [isLoading, course, id]);

  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!course) {
    return null; 
  }
  const calculateCompletedLectures = (lectures) =>
    lectures.filter((lecture) => lecture.completed).length;

  const calculateTotalTime = (lectures) =>
    lectures.reduce((total, lecture) => total + lecture.duration, 0);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours} giờ` : ""} ${mins} phút`.trim();
  };

  return (
    <>
      <NavBar className="mb-2" />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r">
          <div className="mb-6">
            <img
              src={course.images[0]}
              alt={course.title}
              className="w-full h-40 object-cover mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>

          <div>
            {course.sections.map((section, index) => {
              const completedLectures = calculateCompletedLectures(
                section.lectures
              );
              const totalLectures = section.lectures.length;
              const totalTime = calculateTotalTime(section.lectures);

              return (
                <div key={section.section_id} className="mb-4">
                  <h2
                    className="text-xl font-semibold text-gray-800 cursor-pointer mb-2 hover:text-blue-600 transition-colors duration-200 flex justify-between items-center"
                    onClick={() =>
                      setSelectedSection(
                        selectedSection === section ? null : section
                      )
                    }
                  >
                    <span>{section.title}</span>
                    <span className="text-sm text-gray-500">
                      {completedLectures}/{totalLectures} | {formatTime(totalTime)}
                    </span>
                  </h2>
                  {selectedSection === section && (
                    <ul className="ml-4 space-y-2">
                      {section.lectures.map((lecture) => (
                        <li
                          key={lecture.lecture_id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
                          onClick={() => setSelectedLecture(lecture)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={lecture.completed}
                              className="mr-2"
                              readOnly
                            />
                            <span>{lecture.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {lecture.duration} phút
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {index < course.sections.length - 1 && (
                    <hr className="my-4 border-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4 max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md overflow-y-auto">
          {selectedLecture ? (
            <div>
              <h2 className="text-3xl font-semibold mb-4">
                {selectedLecture.title}
              </h2>

              {selectedLecture.content_type.toLowerCase() === "video" &&
                selectedLecture.video_url && (
                  <div className="relative h-0 pb-[56.25%] mb-4">
                    <video
                      className="absolute top-0 left-0 w-full h-full"
                      controls
                    >
                      <source
                        src={selectedLecture.video_url}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

              {selectedLecture.content_type.toLowerCase() === "pdf" &&
                selectedLecture.document_url && (
                  <iframe
                    src={selectedLecture.document_url}
                    className="w-full h-[600px] max-h-[90vh] border border-gray-300"
                    title={selectedLecture.title}
                  />
                )}

              <p className="text-gray-600 mt-4">
                Duration: {selectedLecture.duration} minutes
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedLecture(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Back to Sections
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              <h3 className="text-2xl font-semibold mb-1">
                Chọn bài giảng để hiển thị nội dung.
              </h3>
              <QuestionsAndAnswers/>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseViewer;
