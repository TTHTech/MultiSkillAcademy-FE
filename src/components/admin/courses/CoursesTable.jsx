import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

// Dữ liệu mẫu cho các khóa học
const COURSE_DATA = [
  { 
    id: 1, 
    name: "React Basics", 
    instructorName: "John Doe", 
    category: "Web Development", 
    price: 59.99, 
    status: "Pending",
    description: "This is a basic course on React.", 
    duration: "10 hours", 
    language: "English",
    imageUrl: "https://i.pinimg.com/originals/92/32/3b/92323bb410cc82cecf739c87c0d31187.jpg" 
  },
  { 
    id: 2, 
    name: "Advanced CSS", 
    instructorName: "Jane Smith", 
    category: "Design", 
    price: 39.99, 
    status: "Pending", 
    description: "Advanced CSS for designers.", 
    duration: "7 hours", 
    language: "English",
    imageUrl: "https://khoinguonsangtao.vn/wp-content/uploads/2022/08/anh-one-piece.jpg"
  },
  { 
    id: 3, 
    name: "Python for Beginners", 
    instructorName: "Alice Brown", 
    category: "Programming", 
    price: 199.99, 
    status: "Pending", 
    description: "Python for absolute beginners.", 
    duration: "15 hours", 
    language: "English",
    imageUrl: "https://khoinguonsangtao.vn/wp-content/uploads/2022/08/anh-one-piece.jpg"
  },
  // Thêm nhiều khóa học khác...
];

// Số lượng khóa học hiển thị mỗi trang
const ITEMS_PER_PAGE = 10;

const CoursesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Lưu trữ trang hiện tại
  const [editingCourse, setEditingCourse] = useState(null); // Lưu trữ khóa học đang xem

  // Lọc khóa học theo từ khóa tìm kiếm
  const filteredCourses = COURSE_DATA.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  // Lấy các khóa học hiển thị trên trang hiện tại
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1); // Quay lại trang đầu khi tìm kiếm
  };

  const handleAccept = (courseId) => {
    console.log(`Accepted course with ID: ${courseId}`);
  };

  const handleReject = (courseId) => {
    console.log(`Rejected course with ID: ${courseId}`);
  };

  const handleView = (course) => {
    setEditingCourse(course); // Hiển thị chi tiết khóa học
  };

  const handleSave = () => {
    setEditingCourse(null); // Đóng form sau khi lưu
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Courses Pending Approval</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search courses...'
            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
      </div>

      {editingCourse ? (
        // Form chi tiết khóa học
        <div className='bg-gray-700 p-4 rounded-lg'>
          {/* Ảnh khóa học */}
          <div className="flex justify-center mb-4">
            <img 
              src={editingCourse.imageUrl} 
              alt={editingCourse.name} 
              className="w-100 h-100 object-cover rounded-lg" 
            />
          </div>

          <h3 className='text-lg font-semibold text-gray-100 mb-4'>Course Details</h3>

          {/* Hiển thị thông tin chi tiết của khóa học */}
          <div className='mb-4'>
            <label className='text-gray-400'>Name:</label>
            <input
              type='text'
              name='name'
              value={editingCourse.name}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Instructor:</label>
            <input
              type='text'
              name='instructorName'
              value={editingCourse.instructorName}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Category:</label>
            <input
              type='text'
              name='category'
              value={editingCourse.category}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Description:</label>
            <textarea
              name='description'
              value={editingCourse.description}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Price:</label>
            <input
              type='text'
              name='price'
              value={`$${editingCourse.price}`}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Duration:</label>
            <input
              type='text'
              name='duration'
              value={editingCourse.duration}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Language:</label>
            <input
              type='text'
              name='language'
              value={editingCourse.language}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='flex justify-end'>
            <button
              className='bg-green-500 text-white px-4 py-2 rounded-lg mr-2'
              onClick={() => handleAccept(editingCourse.id)}
            >
              Accept
            </button>
            <button
              className='bg-red-500 text-white px-4 py-2 rounded-lg mr-2'
              onClick={() => handleReject(editingCourse.id)}
            >
              Reject
            </button>
            <button
              className='bg-gray-500 text-white px-4 py-2 rounded-lg'
              onClick={handleSave}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        // Bảng hiển thị danh sách khóa học
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-700'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Name</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Instructor</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Category</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Price</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-700'>
              {currentCourses.map((course) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{course.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{course.instructorName}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{course.category}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>${course.price.toFixed(2)}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-yellow-400'>{course.status}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                    <button
                      className='text-blue-400 hover:text-blue-300 mr-2'
                      onClick={() => handleView(course)}
                    >
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CoursesTable;
