import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import QuestionsAndAnswers from "./QuestionAndAnswers";
const CourseViewer = () => {
  const [course, setCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [completionMessage, setCompletionMessage] = useState("");
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/student/study-courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
      });
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const handleNextLecture = () => {
    if (selectedSection) {
      const currentIndex = selectedSection.lectures.findIndex(
        (lecture) => lecture.lecture_id === selectedLecture.lecture_id
      );

      if (currentIndex < selectedSection.lectures.length - 1) {
        setSelectedLecture(selectedSection.lectures[currentIndex + 1]);
      } else {
        const sectionIndex = course.sections.findIndex(
          (section) => section.section_id === selectedSection.section_id
        );

        if (sectionIndex < course.sections.length - 1) {
          const nextSection = course.sections[sectionIndex + 1];
          setSelectedSection(nextSection);
          setSelectedLecture(nextSection.lectures[0]);
          setCompletionMessage("");
        } else {
          setCompletionMessage("Bạn đã hoàn thành khóa học!");
        }
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <div className="mb-6">
          <img
            src={course.images[0]}
            alt={course.title}
            className="w-full h-40 object-cover mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>

        <div>
          {course.sections.map((section) => (
            <div key={section.section_id} className="mb-6">
              <h2
                className="text-xl font-semibold text-gray-800 cursor-pointer mb-2 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setSelectedSection(section)}
              >
                {section.title}
              </h2>
              {selectedSection === section && (
                <ul className="ml-4 space-y-2">
                  {section.lectures.map((lecture) => (
                    <li
                      key={lecture.lecture_id}
                      className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                        selectedLecture === lecture
                          ? "bg-blue-200 text-blue-800"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedLecture(lecture)}
                    >
                      {lecture.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
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
                    <source src={selectedLecture.video_url} type="video/mp4" />
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
                onClick={handleNextLecture}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                disabled={!selectedSection}
              >
                Next Lecture
              </button>
            </div>

            {completionMessage && (
              <div className="mt-4 text-green-600 font-semibold">
                {completionMessage}
              </div>
            )}

            {/* Questions and Answers Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">
                Questions and Answers
              </h3>
              <QuestionsAndAnswers courseId={id} />
              </div>
          </div>
        ) : (
          <div className="text-gray-600">
            <h3 className="text-2xl font-semibold mb-1">
              Chọn bài giảng để hiển thị nội dung.
            </h3>
            <div className="mt-8">
              <h3 className="text-1xl font-semibold mb-1">
                Questions and Answers
              </h3>
              <QuestionsAndAnswers courseId={id} />
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseViewer;
