import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QuestionsAndAnswers from "../../../pages/student/courses/QuestionAndAnswers";
import TabComment from "../../student/content/TabComment";
import TabListTest from "./TabListTest";

const MainContent = ({ selectedLecture, setSelectedLecture, lectures }) => {
  const { id } = useParams(); // Lấy id khóa học từ URL
  const [selectedTab, setSelectedTab] = useState(0); // Tab hiện tại: 0 - Bình Luận, 1 - Hỏi Đáp, 2 - Bài Kiểm Tra
  const [currentVideoTime, setCurrentVideoTime] = useState(0); // Thời gian xem video hiện tại
  const videoRef = useRef(null); // Tham chiếu đến thẻ video

  // Khôi phục thời gian xem video từ localStorage khi component được tải
  useEffect(() => {
    if (selectedLecture) {
      const savedTime = localStorage.getItem(
        `videoTime-${id}-${selectedLecture.lecture_id}`
      );
      if (savedTime) {
        setCurrentVideoTime(parseFloat(savedTime)); // Khôi phục thời gian xem video
      } else {
        setCurrentVideoTime(0); // Nếu không có dữ liệu lưu, bắt đầu từ 0
      }
    }
  }, [id, selectedLecture]);

  // Cập nhật thời gian video vào localStorage khi video đang phát
  const handleTimeUpdate = () => {
    if (videoRef.current && selectedLecture) {
      const currentTime = videoRef.current.currentTime;
      setCurrentVideoTime(currentTime);
      localStorage.setItem(
        `videoTime-${id}-${selectedLecture.lecture_id}`,
        currentTime
      );
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
      setSelectedLecture(nextLecture); // Cập nhật bài học mới
      setCurrentVideoTime(0); // Đặt lại thời gian xem video
      localStorage.removeItem(
        `videoTime-${id}-${selectedLecture.lecture_id}`
      ); // Xóa thời gian cũ
    } else {
      console.log("No more lectures available."); // Thông báo nếu không còn bài học tiếp theo
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white overflow-y-auto flex flex-col">
      {selectedLecture ? (
        <div className="flex flex-col flex-grow">
          {/* Phần hiển thị video hoặc nội dung bài học */}
          <div className="flex flex-col flex-grow">
            {selectedLecture.content_type.toLowerCase() === "video" &&
              selectedLecture.video_url && (
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <video
                    key={selectedLecture.lecture_id} // Thêm key để React render lại khi lecture thay đổi
                    ref={videoRef}
                    controls
                    className="w-full h-full"
                    autoPlay
                    onTimeUpdate={handleTimeUpdate} // Gọi mỗi khi thời gian video thay đổi
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
          </div>

          {/* Nút quay lại */}
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

      {/* Tab Navigation */}
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

        {/* Nội dung của các tab */}
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
