import { useState } from "react"; // Import useState để quản lý trạng thái tab
import { useParams } from "react-router-dom"; // Để lấy id từ URL

import QuestionsAndAnswers from "../../../pages/student/courses/QuestionAndAnswers"; // Giả sử bạn có component này cho tab "Bình luận"
import TabComment from "../../student/content/TabComment ";
import TabDocument from "../../student/content/TabDocument";


const MainContent = ({ selectedLecture, setSelectedLecture }) => {
  const { id } = useParams(); // Lấy id từ URL

  const [selectedTab, setSelectedTab] = useState(0); // 0: Bình luận, 1: Tab 2, 2: Tab 3

  return (
    <div className="w-3/4 p-6 bg-white overflow-y-auto"> {/* Phần này là MainContent */}
      {selectedLecture ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{selectedLecture.title}</h2>
          {selectedLecture.content_type.toLowerCase() === "video" &&
            selectedLecture.video_url && (
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <video controls className="w-full h-full">
                  <source src={selectedLecture.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          {selectedLecture.content_type.toLowerCase() === "pdf" &&
            selectedLecture.document_url && (
              <iframe
                src={selectedLecture.document_url}
                className="w-full h-[500px] border"
                title={selectedLecture.title}
              />
            )}
          <p className="text-gray-600 mt-2">
            Thời lượng: {selectedLecture.duration} phút
          </p>
          <button
            onClick={() => setSelectedLecture(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Quay lại danh sách bài giảng
          </button>
        </div>
      ) : null}

      {/* Tab Navigation */}
      <div className="mt-6">
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab(0)}
            className={`py-2 px-4 ${selectedTab === 0 ? "border-b-2 border-blue-500" : "text-gray-600"}`}
          >
            Bình Luận
          </button>
          <button
            onClick={() => setSelectedTab(1)}
            className={`py-2 px-4 ${selectedTab === 1 ? "border-b-2 border-blue-500" : "text-gray-600"}`}
          >
            Hỏi Đáp
          </button>
          <button
            onClick={() => setSelectedTab(2)}
            className={`py-2 px-4 ${selectedTab === 2 ? "border-b-2 border-blue-500" : "text-gray-600"}`}
          >
            Tab 3
          </button>
        </div>

        {/* Nội dung của các tab */}
        <div className="mt-4">
          {selectedTab === 0 && (
            <div>
              <h3 className="text-xl font-semibold">Bình Luận</h3>
              {/* Thêm phần hiển thị bình luận tại đây */}
              <TabComment courseId={id} />
            </div>
          )}

          {selectedTab === 1 && (
            <div>
              <h3 className="text-xl font-semibold">Hỏi Đáp</h3>
              {/* Nội dung cho Tab 2 */}
              <QuestionsAndAnswers courseId={id} />
            </div>
          )}

          {selectedTab === 2 && (
            <div>
              <h3 className="text-xl font-semibold">Tài Liệu</h3>
              {/* Nội dung cho Tab 3 */}
              <TabDocument content="Tab 3 Content" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
