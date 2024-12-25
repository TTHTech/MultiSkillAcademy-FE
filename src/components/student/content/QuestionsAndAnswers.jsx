// components/student/content/CourseContent.js
import React from 'react';
import QuestionsAndAnswers from '../../../pages/student/courses/QuestionAndAnswers';

const CourseContent = ({ selectedLecture, setSelectedLecture, courseId }) => {
  return (
    <div className="w-3/4 p-6 bg-white overflow-y-auto">
      {selectedLecture ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{selectedLecture.title}</h2>
          {selectedLecture.content_type.toLowerCase() === "video" && selectedLecture.video_url && (
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <video controls className="w-full h-full">
                <source src={selectedLecture.video_url} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            </div>
          )}
          {selectedLecture.content_type.toLowerCase() === "pdf" && selectedLecture.document_url && (
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
      ) : (
        <QuestionsAndAnswers courseId={courseId} />
      )}
    </div>
  );
};

export default CourseContent;
