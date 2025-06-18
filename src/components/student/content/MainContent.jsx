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
  FaFlag,
  FaTimes,
  FaLock,
} from "react-icons/fa";
import SupplementaryLectures from "./SupplementaryLectures";
import { decodeId } from "../../../utils/hash";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
import axios from "axios";

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
    <div
      ref={playerRef}
      className="relative w-full h-full bg-black group max-w-full overflow-hidden"
    >
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
  isHoveringButton,
  course,
}) => {
  const { courseHash } = useParams();
  const id = decodeId(courseHash);
  const [selectedTab, setSelectedTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lastWatchedTime, setLastWatchedTime] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const videoRef = useRef(null);

  // Check if lecture is locked
  useEffect(() => {
    if (selectedLecture && course) {
      // Find which section this lecture belongs to
      const section = course.sections.find(s => 
        s.lectures.some(l => l.lecture_id === selectedLecture.lecture_id)
      );
      
      if (section) {
        const lectureIndex = section.lectures.findIndex(
          l => l.lecture_id === selectedLecture.lecture_id
        );
        
        // If this is the first lecture in section, it's always unlocked
        if (lectureIndex === 0) {
          setIsLocked(false);
        } else {
          // Check if previous lecture in same section is completed
          const previousLecture = section.lectures[lectureIndex - 1];
          setIsLocked(!previousLecture.watched);
        }
      }
    }
  }, [selectedLecture, course]);

  // Fetch tiến độ từ API khi chọn bài học mới
  useEffect(() => {
    if (selectedLecture && !isLocked) {
      const fetchProgress = async () => {
        try {
          // Reset states
          setProgress(0);
          setLastWatchedTime(0);
          setHasWatched(false);

          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No authentication token found");
            return;
          }

          // Lấy progress từ localStorage trước
          const savedProgress = restoreVideoProgress(selectedLecture.lecture_id);
          if (savedProgress) {
            setProgress(savedProgress.progress || 0);
            setLastWatchedTime(savedProgress.lastWatchedTime || 0);
            setHasWatched(savedProgress.progress >= 90);
            
            // QUAN TRỌNG: Set thời gian video ngay lập tức
            if (videoRef.current && savedProgress.lastWatchedTime > 0) {
              // Đợi video load metadata trước khi set currentTime
              const setVideoTime = () => {
                if (videoRef.current.readyState >= 1) {
                  videoRef.current.currentTime = savedProgress.lastWatchedTime;
                  console.log("Restored video time to:", savedProgress.lastWatchedTime);
                } else {
                  // Nếu chưa ready, đợi event loadedmetadata
                  videoRef.current.addEventListener('loadedmetadata', () => {
                    videoRef.current.currentTime = savedProgress.lastWatchedTime;
                    console.log("Restored video time after metadata loaded:", savedProgress.lastWatchedTime);
                  }, { once: true });
                }
              };
              setVideoTime();
            }
          }

          // Fetch từ API
          const response = await fetch(
            `${baseUrl}/api/student/lecture-progress/${id}/${selectedLecture.lecture_id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              
              // Chỉ update nếu API có data mới hơn localStorage
              const apiTime = data.lastWatchedTime || 0;
              const localTime = savedProgress?.lastWatchedTime || 0;
              
              if (apiTime > localTime) {
                setProgress(data.progress || 0);
                setLastWatchedTime(data.lastWatchedTime || 0);
                setHasWatched(data.progress >= 90);

                // Set video time từ API nếu lớn hơn
                if (videoRef.current && apiTime > 0) {
                  if (videoRef.current.readyState >= 1) {
                    videoRef.current.currentTime = apiTime;
                  } else {
                    videoRef.current.addEventListener('loadedmetadata', () => {
                      videoRef.current.currentTime = apiTime;
                    }, { once: true });
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error fetching progress:", error);
        } finally {
          if (videoRef.current && selectedLecture.video_url) {
            videoRef.current.load();
          }
        }
      };

      fetchProgress();
    }
  }, [id, selectedLecture, isLocked]);

  // Lưu progress khi chuyển video hoặc unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && selectedLecture && !isLocked) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        if (duration && currentTime) {
          const progressPercent = (currentTime / duration) * 100;
          saveVideoProgress(selectedLecture.lecture_id, currentTime, progressPercent);
          // Gọi API một lần cuối
          if (progressPercent > progress) {
            updateProgressAPI(progressPercent, currentTime);
          }
        }
      }
    };
  }, [selectedLecture, isLocked]);

  // Thêm useEffect để lưu progress khi component unmount hoặc khi user navigate away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current && selectedLecture && !isLocked) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        if (duration && currentTime > 0) {
          const progressPercent = (currentTime / duration) * 100;
          saveVideoProgress(selectedLecture.lecture_id, currentTime, progressPercent);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Save khi component unmount
    };
  }, [selectedLecture, isLocked]);

  // Update progress API
  const updateProgressAPI = async (newProgress, currentTime) => {
    try {
      // Chỉ gọi API khi có thay đổi đáng kể
      if (Math.abs(newProgress - progress) < 5 && newProgress < 90) return;

      const response = await fetch(`${baseUrl}/api/student/update-progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: Number(localStorage.getItem("userId")),
          courseId: id,
          lectureId: selectedLecture.lecture_id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Lưu vào localStorage
      saveVideoProgress(selectedLecture.lecture_id, currentTime, newProgress);

      // Nếu đạt 90%, update watched status
      if (newProgress >= 90 && !hasWatched) {
        setHasWatched(true);
        if (updateProgress) {
          await updateProgress(selectedLecture.lecture_id);
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current && selectedLecture && !isLocked) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;

      if (duration && currentTime) {
        const newProgress = Math.min((currentTime / duration) * 100, 100);
        setProgress(newProgress);

        // Save to localStorage every 3 seconds
        if (Math.floor(currentTime) % 3 === 0) {
          saveVideoProgress(selectedLecture.lecture_id, currentTime, newProgress);
        }

        // Update API at milestones or every 30 seconds
        const milestones = [25, 50, 75, 90, 100];
        const reachedMilestone = milestones.find(m => 
          newProgress >= m && progress < m
        );

        if (reachedMilestone || 
            (currentTime > lastWatchedTime + 30) ||
            (newProgress >= 100 && !hasWatched)) {
          setLastWatchedTime(currentTime);
          updateProgressAPI(newProgress, currentTime);
        }
      }
    }
  };

  // Handle seeking - prevent skipping ahead
  const handleSeeking = () => {
    if (videoRef.current && selectedLecture && !isLocked) {
      const currentTime = videoRef.current.currentTime;
      const savedProgress = restoreVideoProgress(selectedLecture.lecture_id);
      const savedTime = savedProgress ? savedProgress.lastWatchedTime : 0;
      const duration = videoRef.current.duration;
      const lastTime = Math.max(lastWatchedTime, savedTime);
      const threshold = 5;

      // Prevent seeking beyond watched time if not completed
      if (!hasWatched && progress < 100) {
        if (currentTime > lastTime + threshold) {
          videoRef.current.currentTime = lastTime;
          Swal.fire({
            title: "Hãy cố lên!",
            text: "Việc xem đầy đủ nội dung sẽ giúp bạn đạt kết quả tốt nhất!",
            icon: "info",
            timer: 2000,
            showConfirmButton: false
          });
        } else if (
          currentTime >= duration - threshold &&
          lastTime < duration - threshold
        ) {
          videoRef.current.currentTime = lastTime;
          Swal.fire({
            title: "Cảnh báo",
            text: "Bạn không thể tua đến cuối video khi chưa hoàn thành nội dung.",
            icon: "warning",
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          setLastWatchedTime(Math.max(lastTime, currentTime));
        }
      }
    }
  };

  // Handle video end
  const handleVideoEnd = async () => {
    if (!lectures || !selectedLecture || !course) return;

    // Mark as 100% completed
    await updateProgressAPI(100, videoRef.current.duration);
    setHasWatched(true);

    // Update parent component và refresh course data
    if (updateProgress) {
      await updateProgress(selectedLecture.lecture_id);
    }

    // Find next lecture
    const allLectures = course.sections.flatMap(section => section.lectures);
    const currentIndex = allLectures.findIndex(
      lecture => lecture.lecture_id === selectedLecture.lecture_id
    );
    const nextLecture = allLectures[currentIndex + 1];

    if (nextLecture) {
      // Check if next lecture is in a new section
      const currentSection = course.sections.find(s => 
        s.lectures.some(l => l.lecture_id === selectedLecture.lecture_id)
      );
      const nextSection = course.sections.find(s => 
        s.lectures.some(l => l.lecture_id === nextLecture.lecture_id)
      );
      
      // If next lecture is first in new section, it's unlocked
      const isFirstInSection = nextSection && 
        nextSection.lectures[0].lecture_id === nextLecture.lecture_id;
      
      if (isFirstInSection || currentSection === nextSection) {
        // Clear video progress của bài mới
        localStorage.removeItem(`video_progress_${id}_${nextLecture.lecture_id}`);
        
        // Delay to ensure state updates
        setTimeout(() => {
          setSelectedLecture(nextLecture);
        }, 500);
      } else {
        Swal.fire({
          title: "Hoàn thành!",
          text: "Bạn đã hoàn thành bài học này. Hãy tiếp tục với bài học tiếp theo.",
          icon: "success",
          confirmButtonText: "OK"
        });
      }
    } else {
      Swal.fire({
        title: "Chúc mừng!",
        text: "Bạn đã hoàn thành tất cả các bài học trong khóa học này.",
        icon: "success",
        confirmButtonText: "OK"
      });
    }
  };

  // Save video progress to localStorage
  const saveVideoProgress = (lectureId, time, progressPercent) => {
    const data = {
      lastWatchedTime: time,
      progress: progressPercent,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(
      `video_progress_${id}_${lectureId}`,
      JSON.stringify(data)
    );
  };

  // Restore video progress from localStorage
  const restoreVideoProgress = (lectureId) => {
    try {
      const saved = localStorage.getItem(`video_progress_${id}_${lectureId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error restoring progress:", error);
    }
    return null;
  };

  // Save current lecture
  const saveCurrentLecture = (lectureId) => {
    localStorage.setItem("current_lecture_id", lectureId);
  };

  useEffect(() => {
    if (selectedLecture) {
      saveCurrentLecture(selectedLecture.lecture_id);
    }
  }, [selectedLecture]);

  const handleReport = async () => {
    const userId = localStorage.getItem("userId");
    const { value: reason } = await Swal.fire({
      title: "Báo cáo khóa học",
      input: "textarea",
      inputLabel: "Lý do báo cáo khóa học",
      inputPlaceholder: "Nhập lý do tại đây...",
      showCancelButton: true,
      confirmButtonText: "Gửi",
      cancelButtonText: "Hủy",
      preConfirm: (val) => {
        if (!val) Swal.showValidationMessage("Bạn phải nhập lý do!");
        return val;
      },
    });
    if (!reason) return;
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${baseUrl}/api/student/course/report`,
        {
          idUserReport: userId,
          targetId: id,
          reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire("Thành công", "Báo cáo đã được gửi!", "success");
    } catch (err) {
      console.error(err);
      await Swal.fire("Lỗi", "Không gửi được báo cáo, thử lại sau.", "error");
    }
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto flex flex-col mt-[90px]">
      {selectedLecture ? (
        <div className="flex flex-col flex-grow">
          <div className="flex flex-col flex-grow relative">
            {/* Video container */}
            <div className="w-full relative">
              {isLocked ? (
                // Locked content
                <div className="w-full md:h-[500px] bg-gray-900 rounded-none overflow-hidden flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <FaLock className="text-6xl mb-4 mx-auto text-gray-400" />
                    <h3 className="text-2xl font-bold mb-2">Bài học bị khóa</h3>
                    <p className="text-gray-300 mb-4">
                      Bạn cần hoàn thành bài học trước để mở khóa bài học này.
                    </p>
                    <button
                      onClick={() => {
                        // Find previous lecture
                        const section = course.sections.find(s => 
                          s.lectures.some(l => l.lecture_id === selectedLecture.lecture_id)
                        );
                        if (section) {
                          const lectureIndex = section.lectures.findIndex(
                            l => l.lecture_id === selectedLecture.lecture_id
                          );
                          if (lectureIndex > 0) {
                            setSelectedLecture(section.lectures[lectureIndex - 1]);
                          }
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Quay lại bài trước
                    </button>
                  </div>
                </div>
              ) : (
                selectedLecture.content_type.toLowerCase() === "video" &&
                selectedLecture.video_url && (
                  <div className="w-full md:h-[500px] bg-black rounded-none overflow-hidden">
                    <CustomVideoPlayer
                      videoRef={videoRef}
                      selectedLecture={selectedLecture}
                      handleSeeking={handleSeeking}
                      handleTimeUpdate={handleTimeUpdate}
                      handleVideoEnd={handleVideoEnd}
                    />

                    {/* Sidebar toggle button */}
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
                            width: isHoveringButton ? "auto" : "40px",
                            paddingRight: isHoveringButton ? "12px" : "2px",
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
                          <span
                            className={`whitespace-nowrap transition-opacity duration-300 ${
                              isHoveringButton ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            Nội dung khóa học
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {!isLocked && selectedLecture.content_type.toLowerCase() === "pdf" &&
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
                  {isLocked ? "Bị khóa" : `${Math.round(progress)}%`}
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
          <button
            onClick={() => setSelectedTab(4)}
            className={`py-2 px-4 ${
              selectedTab === 4
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600"
            }`}
          >
            Tài liệu học tập
          </button>
        </div>
        <button
          onClick={() => handleReport()}
          className="mt-2 ml-2 flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Báo cáo khóa học"
        >
          <FaFlag className="w-4 h-4" />
          <span>Báo cáo khóa học</span>
        </button>
        <div className="mt-2">
          {selectedTab === 0 && (
            <div>
              <h3 className="text-2xl font-semibold ml-8 mt-8">Bình Luận</h3>
              <TabComment courseId={id} />
            </div>
          )}
          {selectedTab === 1 && (
            <div>
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
          {selectedTab === 4 && (
            <div className="mt-6 mb-10">
              <h3 className="text-2xl font-semibold ml-8 mt-8">
                Tài liệu học tập
              </h3>
              <SupplementaryLectures courseId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;