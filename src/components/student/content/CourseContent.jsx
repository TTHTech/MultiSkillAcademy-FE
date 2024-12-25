import React, { useState } from 'react';
import QuestionsAndAnswers from '../../../pages/student/courses/QuestionAndAnswers';

const CourseContent = ({ selectedLecture, setSelectedLecture, courseId }) => {
  const [activeTab, setActiveTab] = useState(1); // Trạng thái tab hiện tại (1 = Comments, 2 = Nội dung khác, 3 = Tab thứ 3)

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-semibold">Bình luận</h3>
            {/* Thêm nội dung bình luận ở đây */}
            <QuestionsAndAnswers courseId={courseId} />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold">Nội dung khác</h3>
            {/* Thêm nội dung khác ở đây */}
            <p>Đây là phần nội dung khác.</p>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold">Tab thứ 3</h3>
            {/* Thêm nội dung cho tab thứ 3 ở đây */}
            <p>Đây là nội dung của tab thứ 3.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-3/4 p-6 bg-white overflow-y-auto ">
      {/* Tab Navigation */}
      <div className="flex border-b mb-[100px]">
        <button
          onClick={() => setActiveTab(1)}
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 1 ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Bình luận
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 2 ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Nội dung khác
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 3 ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Tab thứ 3
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {renderTabContent()}
      </div>

      {selectedLecture && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{selectedLecture.title}</h2>
          {selectedLecture.content_type.toLowerCase() === 'video' && selectedLecture.video_url && (
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <video controls className="w-full h-full">
                <source src={selectedLecture.video_url} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            </div>
          )}
          {selectedLecture.content_type.toLowerCase() === 'pdf' && selectedLecture.document_url && (
            <iframe
              src={selectedLecture.document_url}
              className="w-full h-[500px] border"
              title={selectedLecture.title}
            />
          )}
          <p className="text-gray-600 mt-2">Thời lượng: {selectedLecture.duration} phút</p>
          <button
            onClick={() => setSelectedLecture(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Quay lại danh sách bài giảng
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseContent;
