import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QuestionsAndAnswers from "../../../pages/student/courses/QuestionAndAnswers";
import TabComment from "../../student/content/TabComment";
import TabListTest from "./TabListTest";
import StudyReminder from "./StudyReminder";
import Swal from "sweetalert2";
import {
  FaClock,
  FaChartLine,
  FaPause,
  FaPlay,
  FaBackward,
  FaForward,
  FaVolumeMute,
  FaVolumeUp,
  FaCompress,
  FaExpand,
} from "react-icons/fa";

const CustomVideoPlayer = ({
  videoRef,
  selectedLecture,
  handleSeeking,
  handleTimeUpdate,
  handleVideoEnd,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("play", () => setIsPlaying(true));
      video.addEventListener("pause", () => setIsPlaying(false));
      video.addEventListener("timeupdate", () =>
        setCurrentTime(video.currentTime)
      );
      video.addEventListener("loadedmetadata", () =>
        setDuration(video.duration)
      );

      video.volume = volume;
      video.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleSkip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={playerRef} className="relative w-full h-full bg-black group max-w-full overflow-hidden">
      {/* Video Title Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <h3 className="text-white text-lg font-medium truncate">
          {selectedLecture.title}
        </h3>
      </div>

      <video
        ref={videoRef}
        className="w-full h-full cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onEnded={handleVideoEnd}
      >
        <source src={selectedLecture.video_url} type="video/mp4" />
      </video>

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Bar */}
        <div className="relative w-full h-1.5 bg-gray-600/40 cursor-pointer mb-4 rounded-full group/progress">
          <div
            className="absolute h-full bg-red-600 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const time = parseFloat(e.target.value);
              videoRef.current.currentTime = time;
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="hover:text-red-500 transition-colors duration-200 p-1.5 hover:bg-white/10 rounded-full"
            >
              {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
            </button>
            <button
              onClick={() => handleSkip(-10)}
              className="hover:text-red-500 transition-colors duration-200 p-1.5 hover:bg-white/10 rounded-full"
            >
              <FaBackward size={18} />
            </button>
            <button
              onClick={() => handleSkip(10)}
              className="hover:text-red-500 transition-colors duration-200 p-1.5 hover:bg-white/10 rounded-full"
            >
              <FaForward size={18} />
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 group/volume">
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="hover:text-red-500 transition-colors duration-200 p-1.5 hover:bg-white/10 rounded-full"
              >
                {volume === 0 ? (
                  <FaVolumeMute size={18} />
                ) : (
                  <FaVolumeUp size={18} />
                )}
              </button>
              <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-red-600"
                />
              </div>
            </div>

            {/* Playback Speed Control */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Tốc độ:</span>
              {[0.5, 1, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  className={`px-2 py-1 rounded-full ${
                    playbackRate === rate
                      ? "bg-red-500 text-white"
                      : "bg-white text-red-500"
                  } hover:bg-red-500 hover:text-white transition-colors duration-200`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Time Display */}
            <span className="text-sm font-medium text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="hover:text-red-500 transition-colors duration-200 p-1.5 hover:bg-white/10 rounded-full"
          >
            {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const MainContent = ({
  selectedLecture,
  setSelectedLecture,
  lectures,
  updateProgress,
  toggleSidebar,
  isSidebarOpen,
  setIsHoveringButton,
  isHoveringButton
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
          // Đặt lại video trước khi tải tiến độ mới
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          
          const token = localStorage.getItem("token");
          // Kiểm tra token trước khi gọi API
          if (!token) {
            console.error("No authentication token found");
            return;
          }
          
          const userId = localStorage.getItem("userId");
          const response = await fetch(
            `http://localhost:8080/api/student/lecture-progress/${id}/${selectedLecture.lecture_id}`,
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          
          if (!response.ok) {
            // Xử lý khi response không OK
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          // Kiểm tra content-type
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Received non-JSON response from server");
          }
          
          const data = await response.json();
          setProgress(data.progress || 0);
          setLastWatchedTime(data.lastWatchedTime || 0);

          // Đặt thời gian bắt đầu cho video
          if (videoRef.current && data.lastWatchedTime) {
            // Đảm bảo video đã tải xong
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.currentTime = data.lastWatchedTime;
            };
          }
        } catch (error) {
          console.error("Error fetching progress:", error);
          // Tiếp tục xử lý video ngay cả khi API lỗi
          setProgress(0);
          setLastWatchedTime(0);
        } finally {
          // Đảm bảo video được tải
          if (videoRef.current && selectedLecture.video_url) {
            videoRef.current.load();
          }
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
    <div className="w-full h-full bg-white overflow-y-auto flex flex-col mt-[90px]">
      {selectedLecture ? (
        <div className="flex flex-col flex-grow">
          <div className="flex flex-col flex-grow relative">
            {/* Video container with sidebar toggle button positioned absolutely within */}
            <div className="w-full relative">
              {selectedLecture.content_type.toLowerCase() === "video" &&
                selectedLecture.video_url && (
                  <div className="w-full md:h-[500px] bg-black rounded-none overflow-hidden">
                    <CustomVideoPlayer
                      videoRef={videoRef}
                      selectedLecture={selectedLecture}
                      handleSeeking={handleSeeking}
                      handleTimeUpdate={handleTimeUpdate}
                      handleVideoEnd={handleVideoEnd}
                    />
                    
                    {/* Sidebar toggle button - chỉ hiện trong container video */}
                    {!isSidebarOpen && (
                      <div 
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 group z-10"
                        onMouseEnter={() => setIsHoveringButton(true)}
                        onMouseLeave={() => setIsHoveringButton(false)}
                      >
                        <button
                          onClick={toggleSidebar}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-2 rounded-l-md shadow-md flex items-center overflow-hidden transition-all duration-300"
                          style={{ 
                            width: isHoveringButton ? 'auto' : '40px',
                            paddingRight: isHoveringButton ? '12px' : '2px'
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6 mr-2" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M15 19l-7-7 7-7" 
                            />
                          </svg>
                          <span className={`whitespace-nowrap transition-opacity duration-300 ${
                            isHoveringButton ? 'opacity-100' : 'opacity-0'
                          }`}>
                            Nội dung khóa học
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
            </div>
            
            {selectedLecture.content_type.toLowerCase() === "pdf" &&
              selectedLecture.document_url && (
                <iframe
                  src={selectedLecture.document_url}
                  className="w-full h-screen border mb-4"
                  title={selectedLecture.title}
                />
              )}

            <div className="mt-4">
              <p className="flex items-center text-gray-600 text-sm ml-[30px] mt-[30px]">
                <FaClock className="mr-2 text-blue-500" />
                <span className="font-semibold text-gray-700">Thời lượng:</span>
                <span className="ml-1 text-gray-800">
                  {selectedLecture.duration}
                </span>
              </p>

              <p className="flex items-center text-gray-600 text-sm ml-[30px]">
                <FaChartLine className="mr-2 text-green-500" />
                <span className="font-semibold text-gray-700">Tiến độ:</span>
                <span className="ml-1 text-gray-800">
                  {Math.round(progress)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full mt-[200px] mb-[200px]">
          <p className="text-gray-500">Đang tải bài học...</p>
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
          <button
            onClick={() => setSelectedTab(3)}
            className={`py-2 px-4 ${
              selectedTab === 3
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600"
            }`}
          >
            Nhắc nhở học tập
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
              {/* <h3 className="text-2xl font-semibold ml-8 mt-8">Hỏi Đáp</h3> */}
              <QuestionsAndAnswers courseId={id} />
            </div>
          )}
          {selectedTab === 2 && (
            <div>
              <h3 className="text-2xl font-semibold ml-8 mt-8">Bài Kiểm Tra</h3>
              <TabListTest content="Danh sách bài kiểm tra" />
            </div>
          )}
          {selectedTab === 3 && (
            <div className="mt-6 mb-10">
              <h3 className="text-2xl font-semibold ml-8 mt-8">
                Nhắc nhở học tập
              </h3>
              <StudyReminder content="Nhắc nhở học tập" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
