import { Link } from 'react-router-dom';
import { generateCourseDetailUrl } from '../../../utils/routeHelpers';

const CourseCard = ({ course }) => {
  // Tạo URL với ID mã hóa
  const courseDetailUrl = generateCourseDetailUrl(course.id);

  return (
    <Link 
      to={courseDetailUrl}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-200"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.imageUrl || '/images/default-course.jpg'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.discount > 0 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">
            -{course.discount}%
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{course.title}</h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{course.instructorName}</p>
        
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">{course.rating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(course.rating) ? 'text-yellow-500' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-xs ml-1">({course.reviewCount})</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline">
            {course.discount > 0 ? (
              <>
                <span className="text-lg font-bold">{formatCurrency(calculateDiscountedPrice(course.price, course.discount))}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">{formatCurrency(course.price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold">{formatCurrency(course.price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to calculate discounted price
const calculateDiscountedPrice = (price, discountPercentage) => {
  const discount = (price * discountPercentage) / 100;
  return price - discount;
};

export default CourseCard; 