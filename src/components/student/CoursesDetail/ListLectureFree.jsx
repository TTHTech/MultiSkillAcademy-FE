import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ListLectureFree = ({ onClose }) => {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [lectures, setLectures] = useState([]); // Danh sách bài giảng
  const [selectedVideo, setSelectedVideo] = useState(null); // Video đang được chọn
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Quản lý lỗi

  // Fetch lectures từ API
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        console.log("Fetching lectures for courseId:", courseId);
        const response = await axios.get(
          `http://localhost:8080/api/student/lectures/${courseId}`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setLectures(response.data);
          setSelectedVideo(response.data[0]?.videoUrl || null);
        } else {
          throw new Error("Không tìm thấy bài giảng nào cho khóa học này.");
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải bài giảng.");
        console.error("Error fetching lectures:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchLectures();
    } else {
      setError("Không tìm thấy mã khóa học.");
      setLoading(false);
    }
  }, [courseId]);

  // Khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
        <div className="text-white text-lg animate-pulse">Đang tải danh sách bài giảng...</div>
      </div>
    );
  }

  // Khi xảy ra lỗi
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
        <div className="text-red-500 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 mt-[90px]">
      <div className="bg-white rounded-lg w-[90%] h-[90%] max-w-4xl overflow-hidden shadow-lg relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 font-bold text-2xl hover:text-red-700 transition"
        >
          ×
        </button>

        {/* Tiêu đề */}
        <h2 className="text-xl font-bold text-center my-4 text-gray-800">Xem trước khóa học</h2>

        <div className="flex h-full">
          {/* Danh sách bài giảng */}
          <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto border-r">
            <h3 className="font-semibold mb-4 text-gray-700 text-lg">Danh sách video miễn phí</h3>
            <ul className="space-y-4">
              {lectures.map((lecture) => (
                <li
                  key={lecture.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-200 transition ${
                    selectedVideo === lecture.videoUrl ? "bg-gray-200 border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedVideo(lecture.videoUrl)}
                >
                  {/* Icon video */}
                  <span className="bg-blue-500 text-white rounded w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                    ▶
                  </span>
                  {/* Tên bài giảng */}
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-800 truncate">{lecture.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Phần xem video */}
          <div className="w-2/3 p-4 flex items-center justify-center bg-gray-900 mb-[50px]">
            {selectedVideo ? (
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full rounded-lg shadow-lg object-contain"
              />
            ) : (
              <p className="text-gray-400 text-lg font-semibold">
                Chọn một video từ danh sách để xem
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListLectureFree;
