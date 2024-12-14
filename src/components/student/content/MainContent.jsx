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

  // Fetch tiến độ từ API khi chọn bài học mới
  useEffect(() => {
    if (selectedLecture) {
      const fetchProgress = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/student/lecture-progress/${id}/${selectedLecture.lecture_id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch progress.");
          const data = await response.json();
          setProgress(data.progress || 0);
          setLastWatchedTime(data.lastWatchedTime || 0);

          // Đặt thời gian bắt đầu cho video
          if (videoRef.current && data.lastWatchedTime) {
            videoRef.current.currentTime = data.lastWatchedTime;
          }
        } catch (error) {
          console.error("Error fetching progress:", error);
        }
      };

      fetchProgress();
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

        if (currentTime > lastWatchedTime) {
          setLastWatchedTime(currentTime);

          // Gửi API để cập nhật tiến độ
          updateProgressAPI(newProgress, currentTime);

          // Đánh dấu là watched nếu đạt đủ tiến độ
          if (newProgress >= 100) {
            updateProgress(selectedLecture.lecture_id);
          }
        }
      }
    }
  };

  // Gửi API để cập nhật tiến độ
  const updateProgressAPI = async (newProgress, currentTime) => {
    try {
      await fetch("http://localhost:8080/api/student/update-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: Number(localStorage.getItem("userId")),
          courseId: id,
          lectureId: selectedLecture.lecture_id,
          progress: newProgress,
          lastWatchedTime: currentTime,
        }),
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Kiểm tra khi người dùng tua video
  const handleSeeking = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime; // Thời gian hiện tại trong video
      const duration = videoRef.current.duration;

      // Nếu video chưa được hoàn thành, kiểm tra logic tua
      if (progress < 100) {
        if (currentTime > lastWatchedTime + 0.5) {
          videoRef.current.currentTime = lastWatchedTime; // Quay lại thời gian cuối cùng đã xem
          Swal.fire({
            title: "Cảnh báo",
            text: "Bạn không nên tua quá nhanh. Vui lòng xem đầy đủ nội dung để đảm bảo hiệu quả học tập.",
            icon: "warning",
          });
        } else if (currentTime >= duration) {
          videoRef.current.currentTime = lastWatchedTime; // Quay lại thời gian cuối cùng đã xem
          Swal.fire({
            title: "Cảnh báo",
            text: "Bạn không thể tua qua phần chưa hoàn thành.",
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

    // Gọi API để đánh dấu là watched
    updateProgress(selectedLecture.lecture_id);

    // Tìm bài học tiếp theo
    const nextLecture = lectures[currentIndex + 1];

    // Nếu có bài học tiếp theo, chọn bài học đó
    if (nextLecture) {
      setSelectedLecture(nextLecture);
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
