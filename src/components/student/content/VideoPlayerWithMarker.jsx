import React, { useState, useEffect, useRef } from "react";

const VideoPlayerWithMarker = ({ selectedLecture }) => {
  const videoRef = useRef(null);
  const [lastWatchedTime, setLastWatchedTime] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Lưu thời gian video đã xem vào localStorage
  const saveVideoProgress = (time) => {
    localStorage.setItem(`video_progress_${selectedLecture.lecture_id}`, time);
  };

  // Khôi phục thời gian đã xem
  const restoreVideoProgress = () => {
    const savedTime = localStorage.getItem(
      `video_progress_${selectedLecture.lecture_id}`
    );
    return savedTime ? parseFloat(savedTime) : 0;
  };

  useEffect(() => {
    const savedTime = restoreVideoProgress();
    setLastWatchedTime(savedTime);

    // Đặt lại thời gian video
    if (videoRef.current) {
      videoRef.current.currentTime = savedTime;
    }
  }, [selectedLecture]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;

      // Cập nhật phần trăm đã xem
      const progress = (currentTime / duration) * 100;
      setProgressPercentage(progress);

      if (currentTime > lastWatchedTime) {
        setLastWatchedTime(currentTime);
        saveVideoProgress(currentTime);
      }
    }
  };

  return (
    <div className="video-container" style={{ position: "relative" }}>
      {/* Video */}
      <video
        ref={videoRef}
        controls
        onTimeUpdate={handleTimeUpdate}
        className="w-full"
      >
        <source src={selectedLecture.video_url} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>

      {/* Custom Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "0",
          right: "0",
          height: "5px",
          backgroundColor: "#ddd",
        }}
      >
        <div
          style={{
            height: "5px",
            width: `${progressPercentage}%`,
            backgroundColor: "#4caf50",
          }}
        ></div>
      </div>
    </div>
  );
};

export default VideoPlayerWithMarker;
