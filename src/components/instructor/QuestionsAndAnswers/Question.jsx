// import React from "react";

// // Nhận vào câu hỏi và người dùng từ props
// const Question = ({ question, user, onReplyClick }) => {
//   return (
//     <div className="mb-4 p-4 bg-gray-100 rounded-lg">
//       <div className="flex items-center mb-2">
//         <img
//           src={user?.profile_image}
//           alt={user?.full_name}
//           className="w-8 h-8 rounded-full mr-2"
//         />
//         <p className="font-semibold">{user?.full_name}</p>
//       </div>
//       <p className="mb-1">Câu hỏi: {question.question_text}</p>
//       <p className="text-sm text-gray-500">Ngày hỏi: {question.created_at}</p>

//       {/* Nút trả lời */}
//       <button
//         className="text-blue-500 text-sm mt-2"
//         onClick={() => onReplyClick(question.question_id, question.question_text)}
//       >
//         Trả lời
//       </button>
//     </div>
//   );
// };

// export default Question;
