import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QuestionsAndAnswers from "../../../pages/student/courses/QuestionAndAnswers";
import TabComment from "../../student/content/TabComment";
import TabListTest from "./TabListTest";

const MainContent = ({
  selectedLecture,
  setSelectedLecture,
  lectures,
  updateProgress,
}) => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [progress, setProgress] = useState(0); // Tiến độ xem video
  const videoRef = useRef(null);

  // Khôi phục tiến độ từ localStorage khi chọn bài học mới
  useEffect(() => {
    if (selectedLecture) {
      const savedProgress = localStorage.getItem(
        `progress-${id}-${selectedLecture.lecture_id}`
      );
      setProgress(savedProgress ? parseFloat(savedProgress) : 0);

      const setInitialTime = () => {
        if (videoRef.current && savedProgress && !isNaN(savedProgress)) {
          const duration = videoRef.current.duration;
          if (duration && savedProgress) {
            videoRef.current.currentTime = (savedProgress / 100) * duration;
          }
        }
      };

      videoRef.current?.addEventListener("loadedmetadata", setInitialTime);
      return () => {
        videoRef.current?.removeEventListener("loadedmetadata", setInitialTime);
      };
    }
  }, [id, selectedLecture]);

  // Cập nhật tiến độ video khi đang phát
  const handleTimeUpdate = () => {
    if (videoRef.current && selectedLecture) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;

      if (duration && currentTime) {
        const newProgress = Math.min((currentTime / duration) * 100, 100);

        setProgress(newProgress);
        localStorage.setItem(
          `progress-${id}-${selectedLecture.lecture_id}`,
          newProgress
        );

        // Nếu đạt 70% hoặc hơn, đánh dấu "watched"
        if (newProgress >= 70) {
          const watchedKey = `watched-${id}-${selectedLecture.lecture_id}`;
          if (!localStorage.getItem(watchedKey)) {
            localStorage.setItem(watchedKey, "true");
            updateProgress(selectedLecture.lecture_id);
          }
        }

        // Nếu đạt 100%, gọi hàm updateProgress
        if (newProgress === 100) {
          updateProgress(selectedLecture.lecture_id);
        }
      }
    }
  };

  // Khi video kết thúc, tự động chuyển sang bài học tiếp theo
  const handleVideoEnd = () => {
    if (!lectures || !selectedLecture) return;

    const currentIndex = lectures.findIndex(
      (lecture) => lecture.lecture_id === selectedLecture.lecture_id
    );
    const nextLecture = lectures[currentIndex + 1];

    if (nextLecture) {
      setSelectedLecture(nextLecture);
      localStorage.removeItem(`progress-${id}-${selectedLecture.lecture_id}`);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white overflow-y-auto flex flex-col">
      {selectedLecture ? (
        <div className="flex flex-col flex-grow">
          <div className="flex flex-col flex-grow">
            {selectedLecture.content_type.toLowerCase() === "video" &&
              selectedLecture.video_url && (
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <video
                    key={selectedLecture.lecture_id}
                    ref={videoRef}
                    controls
                    className="w-full h-full"
                    autoPlay
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnd}
                  >
                    <source src={selectedLecture.video_url} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </div>
              )}
            {selectedLecture.content_type.toLowerCase() === "pdf" &&
              selectedLecture.document_url && (
                <iframe
                  src={selectedLecture.document_url}
                  className="w-full h-[500px] border mb-4"
                  title={selectedLecture.title}
                />
              )}
            <p className="text-gray-600 mt-2">
              Thời lượng: {selectedLecture.duration} phút
            </p>
            <p className="text-gray-600">Tiến độ: {Math.round(progress)}%</p>
          </div>

          <button
            onClick={() => setSelectedLecture(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Quay lại danh sách bài giảng
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Vui lòng chọn một bài học để bắt đầu.</p>
        </div>
      )}

      <div className="mt-6">
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab(0)}
            className={`py-2 px-4 ${
              selectedTab === 0
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600"
            }`}
          >
            Bình Luận
          </button>
          <button
            onClick={() => setSelectedTab(1)}
            className={`py-2 px-4 ${
              selectedTab === 1
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600"
            }`}
          >
            Hỏi Đáp
          </button>
          <button
            onClick={() => setSelectedTab(2)}
            className={`py-2 px-4 ${
              selectedTab === 2
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600"
            }`}
          >
            Bài Kiểm Tra
          </button>
        </div>

        <div className="mt-4">
          {selectedTab === 0 && (
            <div>
              <h3 className="text-xl font-semibold">Bình Luận</h3>
              <TabComment courseId={id} />
            </div>
          )}
          {selectedTab === 1 && (
            <div>
              <h3 className="text-xl font-semibold">Hỏi Đáp</h3>
              <QuestionsAndAnswers courseId={id} />
            </div>
          )}
          {selectedTab === 2 && (
            <div>
              <h3 className="text-xl font-semibold">Bài Kiểm Tra</h3>
              <TabListTest content="Danh sách bài kiểm tra" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
