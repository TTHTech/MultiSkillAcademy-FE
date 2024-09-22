import { motion } from "framer-motion";
import { CheckCircle, XCircle, Search } from "lucide-react";
import { useState } from "react";

const COURSE_DATA = [
  { id: 1, name: "React Basics", instructorName: "John Doe", category: "Web Development", price: 59.99, status: "Pending" },
  { id: 2, name: "Advanced CSS", instructorName: "Jane Smith", category: "Design", price: 39.99, status: "Pending" },
  { id: 3, name: "Python for Beginners", instructorName: "Alice Brown", category: "Programming", price: 199.99, status: "Pending" },
];

const CoursesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(COURSE_DATA);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = COURSE_DATA.filter(
      (course) =>
        course.name.toLowerCase().includes(term) || course.category.toLowerCase().includes(term)
    );
    setFilteredCourses(filtered);
  };

  const handleAccept = (courseId) => {
    // Logic xử lý chấp nhận course
    console.log(`Accepted course with ID: ${courseId}`);
  };

  const handleReject = (courseId) => {
    // Logic xử lý từ chối course
    console.log(`Rejected course with ID: ${courseId}`);
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
            {filteredCourses.map((course) => (
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
                    className='text-green-400 hover:text-green-300 mr-2'
                    onClick={() => handleAccept(course.id)}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    className='text-red-400 hover:text-red-300'
                    onClick={() => handleReject(course.id)}
                  >
                    <XCircle size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default CoursesTable;
