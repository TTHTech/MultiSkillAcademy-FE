import React, { useState } from 'react';

const CourseInstructor = ({ instructor }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle full description

  // Function to toggle the description view
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Limit description to a certain number of characters
  const truncatedDescription = instructor.description.slice(0, 150); // Adjust character limit as needed

  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Giảng viên</h2>
      
      {/* Instructor Header */}
      <div className="flex items-center mb-4">
        <img 
          src={instructor.image || "https://i1.sndcdn.com/artworks-9IsXLBkEVnMfN6qy-vlBoxg-t500x500.jpg"} // Ảnh mặc định nếu không có ảnh
          alt="Instructor" 
          className="w-16 h-16 rounded-full mr-4" 
        />
        <div>
          <h3 className="text-xl font-semibold text-purple-600">
            {instructor.name}
          </h3>
          <p className="text-gray-500">{instructor.title}</p>
        </div>
      </div>
      
      {/* Instructor Metrics */}
      <div className="flex items-center text-gray-600 mb-4">
        <span className="mr-4">⭐ {instructor.rating} xếp hạng giảng viên</span>
        <span className="mr-4">👤 {instructor.reviews} đánh giá</span>
        <span className="mr-4">👥 {instructor.students} học viên</span>
        <span>📚 {instructor.courses} khóa học</span>
      </div>

      {/* Instructor Description with "Read More" Toggle */}
      <p className="text-gray-700">
        {isExpanded ? instructor.description : `${truncatedDescription}...`}
        {instructor.description.length > 150 && (
          <button 
            onClick={toggleDescription} 
            className="text-purple-600 ml-2 focus:outline-none font-semibold"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </p>
    </div>
  );
};

export default CourseInstructor;
