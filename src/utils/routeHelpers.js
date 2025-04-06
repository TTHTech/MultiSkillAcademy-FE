/**
 * Helper functions for routes and URL generation with encoded IDs
 */

import { encodeId, decodeId } from './idEncoder';

/**
 * Tạo URL cho trang chi tiết khóa học với ID đã mã hóa
 * @param {number} courseId - ID khóa học cần mã hóa
 * @returns {string} - URL cho trang chi tiết khóa học
 */
export const generateCourseDetailUrl = (courseId) => {
  const encodedId = encodeId(courseId);
  return `/course/${encodedId}`;
};

/**
 * Tạo URL cho trang sản phẩm với ID đã mã hóa
 * @param {number} productId - ID sản phẩm cần mã hóa
 * @returns {string} - URL cho trang sản phẩm
 */
export const generateProductUrl = (productId) => {
  const encodedId = encodeId(productId);
  return `/products/${encodedId}`;
};

/**
 * Tạo URL cho trang giảng viên với ID đã mã hóa
 * @param {number} instructorId - ID giảng viên cần mã hóa
 * @returns {string} - URL cho trang giảng viên
 */
export const generateInstructorUrl = (instructorId) => {
  const encodedId = encodeId(instructorId);
  return `/instructors/${encodedId}`;
};

/**
 * Trích xuất và giải mã ID từ một URL
 * @param {string} url - URL cần trích xuất ID
 * @returns {number|null} - ID đã giải mã hoặc null nếu không hợp lệ
 */
export const extractIdFromUrl = (url) => {
  if (!url) return null;
  
  // Lấy phần cuối cùng của URL (sau dấu / cuối cùng)
  const segments = url.split('/');
  const encodedId = segments[segments.length - 1];
  
  return decodeId(encodedId);
}; 