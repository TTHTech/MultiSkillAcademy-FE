import { motion } from "framer-motion";
import { useState } from "react";
import { Search } from "lucide-react";

// Dữ liệu mẫu cho các khóa học đã được chấp nhận
const ACCEPTED_COURSE_DATA = [
  { id: 1, name: "React Basics", instructorName: "John Doe", category: "Web Development", students: 150, earnings: 8999, price: 59.99, imageUrl: "https://i.pinimg.com/736x/ec/0e/87/ec0e87062299980da6d3aca200253ef7.jpg" },
  { id: 2, name: "Advanced CSS", instructorName: "Jane Smith", category: "Design", students: 200, earnings: 11999, price: 39.99, imageUrl: "https://i.pinimg.com/736x/ec/0e/87/ec0e87062299980da6d3aca200253ef7.jpg" },
  { id: 3, name: "Python for Beginners", instructorName: "Alice Brown", category: "Programming", students: 300, earnings: 17999, price: 199.99, imageUrl: "https://i.pinimg.com/736x/ec/0e/87/ec0e87062299980da6d3aca200253ef7.jpg" },
  // Thêm các khóa học mẫu khác...
];

const ITEMS_PER_PAGE = 10; // Số khóa học hiển thị mỗi trang

const AcceptedCoursesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingCourse, setViewingCourse] = useState(null);

  // Lọc các khóa học theo từ khóa tìm kiếm
  const filteredCourses = ACCEPTED_COURSE_DATA.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Xử lý khi bấm nút "View"
  const handleView = (course) => {
    setViewingCourse(course);
  };

  // Xử lý khi xóa khóa học
  const handleDelete = (courseId) => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (confirmed) {
      // Xóa khóa học
      console.log(`Deleted course with ID: ${courseId}`);
      setViewingCourse(null); // Đóng form sau khi xóa
    }
  };

  // Xử lý đóng chi tiết khóa học
  const handleClose = () => {
    setViewingCourse(null);
  };

  // Xử lý phân trang
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
        <h2 className='text-xl font-semibold text-gray-100'>Accepted Courses</h2>

        {/* Thanh tìm kiếm */}
        <div className='relative'>
          <input
            type='text'
            placeholder='Search courses...'
            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
      </div>

      {viewingCourse ? (
        // Hiển thị thông tin chi tiết khóa học khi bấm "View"
        <div className='bg-gray-700 p-4 rounded-lg'>
          {/* Ảnh khóa học */}
          <div className="flex justify-center mb-4">
            <img 
              src={viewingCourse.imageUrl} 
              alt={viewingCourse.name} 
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
              value={viewingCourse.name}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Instructor:</label>
            <input
              type='text'
              name='instructorName'
              value={viewingCourse.instructorName}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Category:</label>
            <input
              type='text'
              name='category'
              value={viewingCourse.category}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Students Enrolled:</label>
            <input
              type='text'
              name='students'
              value={viewingCourse.students}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='mb-4'>
            <label className='text-gray-400'>Earnings:</label>
            <input
              type='text'
              name='earnings'
              value={`$${viewingCourse.earnings}`}
              className='w-full p-2 bg-gray-600 text-white rounded-lg'
              readOnly
            />
          </div>

          <div className='flex justify-end'>
            <button
              className='bg-red-500 text-white px-4 py-2 rounded-lg mr-2'
              onClick={() => handleDelete(viewingCourse.id)}
            >
              Delete
            </button>
            <button
              className='bg-gray-500 text-white px-4 py-2 rounded-lg'
              onClick={handleClose}
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
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Students</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Earnings</th>
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
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{course.students}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>${course.earnings}</td>
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

export default AcceptedCoursesTable;
