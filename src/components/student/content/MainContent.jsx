import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QuestionsAndAnswers from "../../../pages/student/courses/QuestionAndAnswers";
import TabComment from "../../student/content/TabComment";
import TabListTest from "./TabListTest";
import Swal from "sweetalert2";

const MainContent = ({
  selectedLecture,
  setSelectedLecture,
  lectures,
  updateProgress,
}) => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [progress, setProgress] = useState(0); // Tiến độ xem video (theo %)
  const [lastWatchedTime, setLastWatchedTime] = useState(0); // Thời gian cuối cùng đã xem (giây)
  const videoRef = useRef(null);

  const videoKey = `progress-${id}-${selectedLecture?.lecture_id}`;
  const timeKey = `lastWatchedTime-${id}-${selectedLecture?.lecture_id}`;
  const watchedKey = `watched-${id}-${selectedLecture?.lecture_id}`;

  // Khôi phục tiến độ và thời gian cuối cùng đã xem từ localStorage khi chọn bài học mới
  useEffect(() => {
    if (selectedLecture) {
      const savedProgress = localStorage.getItem(videoKey);
      const savedTime = localStorage.getItem(timeKey);
      setProgress(savedProgress ? parseFloat(savedProgress) : 0);
      setLastWatchedTime(savedTime ? parseFloat(savedTime) : 0);

      const setInitialTime = () => {
        if (videoRef.current && savedTime && !isNaN(savedTime)) {
          videoRef.current.currentTime = parseFloat(savedTime);
        }
      };

      videoRef.current?.addEventListener("loadedmetadata", setInitialTime);
      return () => {
        videoRef.current?.removeEventListener("loadedmetadata", setInitialTime);
      };
    }
  }, [id, selectedLecture, videoKey, timeKey]);

  // Cập nhật tiến độ video khi đang phát
  const handleTimeUpdate = () => {
    if (videoRef.current && selectedLecture) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;

      if (duration && currentTime) {
        const newProgress = Math.min((currentTime / duration) * 100, 100);

        setProgress(newProgress);
        if (currentTime > lastWatchedTime) {
          setLastWatchedTime(currentTime);
          localStorage.setItem(timeKey, currentTime); // Lưu thời gian cuối cùng đã xem
        }
        localStorage.setItem(videoKey, newProgress); // Lưu tiến độ theo %

        // Nếu đạt 100%, đánh dấu "watched"
        if (newProgress === 100) {
          if (!localStorage.getItem(watchedKey)) {
            localStorage.setItem(watchedKey, "true");
            updateProgress(selectedLecture.lecture_id);
          }
        }
      }
    }
  };

  // Kiểm tra khi người dùng tua video
  const handleSeeking = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime; // Thời gian hiện tại trong video
      const isWatched = localStorage.getItem(watchedKey) === "true"; // Kiểm tra nếu bài học đã hoàn thành

      // Nếu video chưa được hoàn thành
      if (!isWatched) {
        const duration = videoRef.current.duration;

        // Không cho phép tua vượt qua phần đã xem
        if (currentTime > lastWatchedTime + 0.5) {
          videoRef.current.currentTime = lastWatchedTime; // Quay lại thời gian cuối cùng đã xem
          Swal.fire({
            title: "Cảnh báo",
            text: `Bạn không nên tua quá nhanh. Vui lòng xem đầy đủ nội dung để đảm bảo hiệu quả học tập.`,
            icon: "warning",
          });
        }

        // Không cho phép tua vượt quá thời gian cuối cùng của video
        if (currentTime >= duration) {
          videoRef.current.currentTime = lastWatchedTime; // Quay lại thời gian cuối cùng đã xem
          Swal.fire({
            title: "Cảnh báo",
            text: `Bạn không thể tua qua phần chưa hoàn thành.`,
            icon: "warning",
          });
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

    // Tìm bài học tiếp theo
    const nextLecture = lectures[currentIndex + 1];

    // Nếu có bài học tiếp theo, chọn bài học đó
    if (nextLecture) {
      setSelectedLecture(nextLecture);
      localStorage.removeItem(videoKey);
      localStorage.removeItem(timeKey);
    } else {
      // Nếu không có bài học tiếp theo, thông báo hoàn thành khóa học
      Swal.fire({
        title: "Khóa học đã hoàn thành",
        text: "Bạn đã hoàn thành tất cả các bài học. Vui lòng chọn bài học hoặc khóa học khác.",
        icon: "success",
      });
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
                    onTimeUpdate={handleTimeUpdate} // Cập nhật tiến độ
                    onSeeking={handleSeeking} // Kiểm tra khi tua video
                    onEnded={handleVideoEnd} // Xử lý khi video kết thúc
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
