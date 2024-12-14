// import React from "react";

// const courses = [
//   {
//     title: "Javascript cho người mới bắt đầu",
//     instructor: "Hau Nguyen",
//     rating: 4.7,
//     reviews: 466,
//     price: 999000,
//     bestSeller: false,
//     image: "https://i.ytimg.com/vi/f-dImq4LNOM/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGH8gEygmMA8=&rs=AOn4CLAZ5VeCHO6MIie0QhjffRlKHkjIpw", // Thay bằng link ảnh thực tế
//   },
//   {
//     title: "Bí Mật Đàm Phán",
//     instructor: "Jessica Thao Nguyen",
//     rating: 4.6,
//     reviews: 302,
//     price: 1699000,
//     bestSeller: false,
//     image: "https://i.ytimg.com/vi/f-dImq4LNOM/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGH8gEygmMA8=&rs=AOn4CLAZ5VeCHO6MIie0QhjffRlKHkjIpw",
//   },
//   {
//     title: "AI for HR - Chinh phục AI trong Nhân sự",
//     instructor: "Nông Vương Phi",
//     rating: 4.6,
//     reviews: 287,
//     price: 699000,
//     bestSeller: true,
//     image: "https://i.ytimg.com/vi/f-dImq4LNOM/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGH8gEygmMA8=&rs=AOn4CLAZ5VeCHO6MIie0QhjffRlKHkjIpw",
//   },
//   {
//     title: "AWS Cloud cơ bản (Tiếng Việt)",
//     instructor: "Hoa Nguyen Huu",
//     rating: 4.5,
//     reviews: 200,
//     price: 1399000,
//     bestSeller: true,
//     image: "https://i.ytimg.com/vi/f-dImq4LNOM/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGH8gEygmMA8=&rs=AOn4CLAZ5VeCHO6MIie0QhjffRlKHkjIpw",
//   },
//   // Thêm các khóa học khác theo định dạng tương tự
// ];

// const CourseListSection = () => {
//   return (
//     <div className="p-6 bg-gray-50">
//       <h2 className="text-2xl font-bold text-gray-900 mb-4">
//         Các khóa học hàng đầu về Tiếng Việt
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {courses.map((course, index) => (
//           <div
//             key={index}
//             className="border rounded-lg shadow-md bg-white overflow-hidden"
//           >
//             <img
//               src={course.image}
//               alt={course.title}
//               className="w-full h-40 object-cover"
//             />
//             <div className="p-4">
//               <h3 className="font-bold text-gray-900 text-lg mb-2">
//                 {course.title}
//               </h3>
//               <p className="text-gray-700 text-sm mb-2">{course.instructor}</p>
//               <div className="flex items-center mb-2">
//                 <span className="text-yellow-500 font-bold text-lg mr-1">
//                   {course.rating}
//                 </span>
//                 <div className="flex space-x-1">
//                   {[...Array(5)].map((_, i) => (
//                     <i
//                       key={i}
//                       className={`fas fa-star ${
//                         i < Math.round(course.rating)
//                           ? "text-yellow-500"
//                           : "text-gray-300"
//                       }`}
//                     ></i>
//                   ))}
//                 </div>
//                 <span className="ml-2 text-sm text-gray-600">
//                   ({course.reviews})
//                 </span>
//               </div>
//               <p className="text-gray-900 font-bold text-lg">
//                 đ {course.price.toLocaleString("vi-VN")}
//               </p>
//               {course.bestSeller && (
//                 <span className="inline-block bg-yellow-300 text-yellow-900 text-sm font-bold rounded-full px-2 py-1 mt-2">
//                   Bán chạy nhất
//                 </span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CourseListSection;
