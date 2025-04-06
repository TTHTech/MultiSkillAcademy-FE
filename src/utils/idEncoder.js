/**
 * Utility for encoding and decoding course IDs to hide the actual database IDs
 */

// Tiền tố mã hóa
const PREFIX = "CR";

// Mã hóa một ID từ số thành chuỗi
export const encodeId = (id) => {
  if (!id) return "";
  
  // Cộng thêm offset để tránh số 0
  const offsetId = parseInt(id) + 1000;
  
  // Chuyển sang hệ cơ số 36 (0-9, A-Z) và thêm padding
  let encoded = offsetId.toString(36).toUpperCase();
  
  // Thêm padding để đảm bảo độ dài nhất định (3 ký tự)
  while (encoded.length < 3) {
    encoded = '0' + encoded;
  }
  
  // Thêm tiền tố
  return PREFIX + encoded;
};

// Giải mã từ chuỗi thành ID
export const decodeId = (encodedId) => {
  if (!encodedId || typeof encodedId !== 'string') return null;
  
  try {
    // Kiểm tra xem có phải định dạng CR + số không
    if (encodedId.startsWith(PREFIX)) {
      // Lấy phần sau tiền tố
      const base36Part = encodedId.substring(PREFIX.length);
      
      // Chuyển từ base36 về số thập phân
      const decodedWithOffset = parseInt(base36Part, 36);
      
      // Trừ offset để có ID gốc
      return decodedWithOffset - 1000;
    }
    
    // Thử parse trực tiếp nếu không khớp định dạng
    return parseInt(encodedId, 10);
  } catch (error) {
    console.error("Error decoding ID:", error);
    // Trả về ID gốc nếu không giải mã được
    return encodedId.replace(/\D/g, '');
  }
};

// Kiểm tra xem một chuỗi có phải là ID đã mã hóa không
export const isEncodedId = (id) => {
  if (!id || typeof id !== 'string') return false;
  
  // Kiểm tra tiền tố CR và theo sau là số và chữ
  return id.startsWith(PREFIX) && /^CR[0-9A-Z]+$/.test(id);
}; 