import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QuestionsAndAnswers from "../../../pages/student/courses/QuestionAndAnswers";
import TabComment from "../../student/content/TabComment";
import TabListTest from "./TabListTest";
import Swal from "sweetalert2";
import { FaClock, FaChartLine } from "react-icons/fa";
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
    if (videoRef.current && selectedLecture) {
      const currentTime = videoRef.current.currentTime; // Thời gian hiện tại
      const savedTime = restoreVideoProgress(selectedLecture.lecture_id) || 0; // Thời gian đã lưu
      const duration = videoRef.current.duration; // Tổng thời lượng video
      const lastTime = lastWatchedTime || savedTime; // Thời gian cuối cùng đã xem
      const threshold = 5; // Ngưỡng sai lệch cho phép

      // Trường hợp video chưa hoàn thành
      if (progress < 100) {
        // Chặn tua vượt qua lastWatchedTime
        if (currentTime > lastTime + threshold) {
          videoRef.current.currentTime = lastTime; // Quay lại vị trí đã xem
          Swal.fire({
            title: "Hãy cố lên!",
            text: "Việc xem đầy đủ nội dung sẽ giúp bạn đạt kết quả tốt nhất và phát triển kỹ năng của mình!",
            icon: "success",
          });
        }
        // Chặn tua đến cuối video nếu chưa hoàn thành
        else if (
          currentTime >= duration - threshold &&
          lastTime < duration - threshold
        ) {
          videoRef.current.currentTime = lastTime; // Quay lại vị trí đã xem
          Swal.fire({
            title: "Cảnh báo",
            text: "Bạn không thể tua đến cuối video khi chưa hoàn thành nội dung.",
            icon: "warning",
          });
        }
        // Cho phép tua trong phạm vi từ 0 đến lastWatchedTime
        else {
          saveVideoProgress(selectedLecture.lecture_id, currentTime); // Lưu tiến trình
          setLastWatchedTime(Math.max(lastTime, currentTime)); // Cập nhật lastWatchedTime
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
  // Lưu thời gian xem vào localStorage
  const saveVideoProgress = (lectureId, time) => {
    localStorage.setItem(`video_progress_${id}_${lectureId}`, time);
  };

  // Khôi phục thời gian xem từ localStorage
  const restoreVideoProgress = (lectureId) => {
    const savedTime = localStorage.getItem(`video_progress_${id}_${lectureId}`);
    return savedTime ? parseFloat(savedTime) : 0;
  };
  const saveCurrentLecture = (lectureId) => {
    localStorage.setItem("current_lecture_id", lectureId);
  };
  const restoreCurrentLecture = () => {
    return localStorage.getItem("current_lecture_id");
  };
  useEffect(() => {
    if (selectedLecture) {
      saveCurrentLecture(selectedLecture.lecture_id); // Lưu bài giảng hiện tại
    }
  }, [selectedLecture]);
  useEffect(() => {
    const savedLectureId = restoreCurrentLecture();

    if (savedLectureId && lectures) {
      const savedLecture = lectures.find(
        (lecture) => lecture.lecture_id === parseInt(savedLectureId)
      );

      if (savedLecture) {
        setSelectedLecture(savedLecture);
      }
    }
  }, [lectures]);

  // Hàm xử lý trạng thái video
  const handleVideoState = (action, lectureId, time = 0) => {
    switch (action) {
      case "save":
        saveVideoProgress(lectureId, time);
        break;
      case "restore":
        return restoreVideoProgress(lectureId);
      default:
        console.error("Invalid action for handleVideoState");
        break;
    }
  };
  // Chuyển đổi giây sang dạng phút hoặc giây
  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "Đang tải..."; // Xử lý dữ liệu không hợp lệ
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    if (minutes > 0) {
      return seconds > 0
        ? `${minutes} phút ${seconds} giây`
        : `${minutes} phút`;
    }
    return `${seconds} giây`;
  };

  return (
    <div
      className="w-full h-full bg-white overflow-y-auto flex flex-col mt-[90px]"
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE và Edge */,
      }}
    >
      {selectedLecture ? (
        <div className="flex flex-col flex-grow">
          <div className="flex flex-col flex-grow">
            {selectedLecture.content_type.toLowerCase() === "video" &&
              selectedLecture.video_url && (
                <div className="w-full md:w-[1370px] md:h-[500px]  border-black rounded-lg shadow-lg">
                  <video
                    key={selectedLecture.lecture_id}
                    ref={videoRef}
                    controls
                    className="w-full h-full"
                    autoPlay
                    onLoadedMetadata={() => {
                      const savedTime = handleVideoState(
                        "restore",
                        selectedLecture.lecture_id
                      );
                      if (videoRef.current && savedTime) {
                        videoRef.current.currentTime = savedTime; // Đặt lại tiến trình đã xem
                      }
                    }}
                    onSeeking={handleSeeking} // Kiểm tra khi tua video
                    onTimeUpdate={handleTimeUpdate} // Cập nhật tiến độ
                    onEnded={() => {
                      handleVideoState("save", selectedLecture.lecture_id, 0);
                      handleVideoEnd();
                    }}
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
            <p className="flex items-center text-gray-600 mt-2 text-sm ml-[30px] mt-[30px]">
              <FaClock className="mr-2 text-blue-500" />{" "}
              {/* Biểu tượng thời lượng */}
              <span className="font-semibold text-gray-700">Thời lượng:</span>
              <span className="ml-1 text-gray-800">
                {selectedLecture.duration}
              </span>
            </p>

            <p className="flex items-center text-gray-600 mt-1 text-sm ml-[30px] ">
              <FaChartLine className="mr-2 text-green-500" />{" "}
              {/* Biểu tượng tiến độ */}
              <span className="font-semibold text-gray-700">Tiến độ:</span>
              <span className="ml-1 text-gray-800">
                {Math.round(progress)}%
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full mt-[200px] mb-[200px]">
          <p className="text-gray-500">Vui lòng chọn một bài học để bắt đầu.</p>
        </div>
      )}

      <div className="mt-4">
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

        <div className="mt-2">
          {selectedTab === 0 && (
            <div>
              <h3 className="text-2xl font-semibold ml-8 mt-8">Bình Luận</h3>
              <TabComment courseId={id} />
            </div>
          )}
          {selectedTab === 1 && (
            <div>
              <h3 className="text-2xl font-semibold ml-8 mt-8">Hỏi Đáp</h3>
              <QuestionsAndAnswers courseId={id} />
            </div>
          )}
          {selectedTab === 2 && (
            <div>
              <h3 className="text-2xl font-semibold ml-8 mt-8">Bài Kiểm Tra</h3>
              <TabListTest content="Danh sách bài kiểm tra" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
