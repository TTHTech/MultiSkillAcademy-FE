import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { X, Play, Video, AlertCircle, Loader } from 'lucide-react';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col items-center">
      <Loader className="w-8 h-8 text-purple-500 animate-spin mb-4" />
      <p className="text-white text-lg font-medium">Đang tải danh sách bài giảng...</p>
    </div>
  </div>
);

const ErrorScreen = ({ message }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center max-w-md mx-4">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-gray-800 text-lg font-medium text-center">{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Thử lại
      </button>
    </div>
  </div>
);

const VideoPlayer = ({ url }) => {
  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Video className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">
          Chọn một video từ danh sách để xem
        </p>
      </div>
    );
  }

  return (
    <video
      src={url}
      controls
      autoPlay
      className="w-full h-full rounded-xl shadow-lg object-contain"
      controlsList="nodownload"
      playsInline
    >
      <track kind="captions" />
    </video>
  );
};

const LectureItem = ({ lecture, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(lecture.videoUrl)}
    className={`
      group flex items-start p-4 rounded-xl cursor-pointer
      transition-all duration-200 hover:bg-gray-100
      ${isSelected ? 'bg-purple-50 border-purple-200' : 'hover:border-gray-200'}
    `}
  >
    <div className={`
      w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
      transition-colors duration-200
      ${isSelected ? 'bg-purple-500' : 'bg-gray-200 group-hover:bg-purple-100'}
    `}>
      <Play className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-purple-500'}`} />
    </div>

    <div className="ml-4 flex-1">
      <h4 className={`
        font-medium transition-colors duration-200
        ${isSelected ? 'text-purple-700' : 'text-gray-800 group-hover:text-purple-600'}
      `}>
        {lecture.title}
      </h4>
      {lecture.duration && (
        <p className="text-sm text-gray-500 mt-1">
          Thời lượng: {lecture.duration}
        </p>
      )}
    </div>
  </div>
);

const ListLectureFree = ({ onClose }) => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        if (!courseId) throw new Error("Không tìm thấy mã khóa học.");

        const response = await axios.get(
          `http://localhost:8080/api/student/lectures/${courseId}`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setLectures(response.data);
          setSelectedVideo(response.data[0]?.videoUrl);
        } else {
          throw new Error("Không tìm thấy bài giảng nào cho khóa học này.");
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải bài giảng.");
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseId]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4 mt-[90px]">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="absolute top-0 inset-x-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Xem trước khóa học
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="h-full pt-16 flex">
          {/* Sidebar - Lecture List */}
          <div className="w-96 border-r bg-gray-50 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold text-gray-800">
                Danh sách video miễn phí ({lectures.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {lectures.map((lecture) => (
                <LectureItem
                  key={lecture.id}
                  lecture={lecture}
                  isSelected={selectedVideo === lecture.videoUrl}
                  onSelect={setSelectedVideo}
                />
              ))}
            </div>
          </div>

          {/* Main Content - Video Player */}
          <div className="flex-1 bg-gray-900 flex items-center justify-center p-6">
            <VideoPlayer url={selectedVideo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListLectureFree;