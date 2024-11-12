// import React from "react";

// // Nhận vào câu trả lời và người dùng từ props
// const Answers = ({ answers, getUserById }) => {
//   return (
//     <div className="mt-2 pl-4 border-l-2 border-gray-300">
//       {answers.map((answer, index) => {
//         const user = getUserById(answer.user_id);
//         return (
//           <div key={index} className="mb-2">
//             <div className="flex items-center mb-1">
//               <img
//                 src={user?.profile_image}
//                 alt={user?.full_name}
//                 className="w-8 h-8 rounded-full mr-2"
//               />
//               <p className="font-semibold">{user?.full_name}</p>
//             </div>
//             <p className="text-sm">{answer.answer_text}</p>
//             <p className="text-sm text-gray-500">Ngày trả lời: {answer.created_at}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Answers;
