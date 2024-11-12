// const CourseQA = ({
//     course,
//     questions,
//     users,
//     onReplyClick,
//     onCancelReply,
//     replyingTo,
//     replyText,
//     setReplyText,
//     handleReplySubmit,
// }) => {
//     const getUserById = (userId) => {
//         return users.find((user) => user.user_id === userId);
//     };

//     return (
//         <div className="m-3 bg-white shadow-lg rounded-lg p-6">
//             <div className="mb-6">
//                 <img
//                     src={course.thumbnail}
//                     alt={course.title}
//                     className="w-full h-60 object-cover rounded-lg"
//                 />
//                 <h2 className="text-2xl font-bold mt-4">{course.title}</h2>
//                 <p className="text-gray-600 mt-2">{course.description}</p>
//             </div>

//             <div>
//                 <h3 className="text-xl font-semibold mb-4">Câu hỏi & Trả lời</h3>
//                 {questions.length === 0 ? (
//                     <p className="text-gray-500">Không có câu hỏi nào cho khóa học này.</p>
//                 ) : (
//                     questions.map((question) => {
//                         const user = getUserById(question.user_id);
//                         const isReplyingToThisQuestion =
//                             replyingTo &&
//                             replyingTo.courseId === course.course_id &&
//                             replyingTo.questionId === question.question_id;

//                         return (
//                             <div key={question.question_id} className="mb-4 p-4 bg-gray-100 rounded-lg">
//                                 <div className="flex items-center mb-2">
//                                     <img
//                                         src={user?.profile_image}
//                                         alt={user?.full_name}
//                                         className="w-8 h-8 rounded-full mr-2"
//                                     />
//                                     <p className="font-semibold">{user?.full_name}</p>
//                                 </div>
//                                 <p className="mb-1">Câu hỏi: {question.question_text}</p>
//                                 <p className="text-sm text-gray-500">Ngày hỏi: {question.created_at}</p>

//                                 {question.answers.length > 0 ? (
//                                     <div className="mt-2 pl-4 border-l-2 border-gray-300">
//                                         {question.answers.map((answer) => {
//                                             const answerUser = getUserById(answer.user_id);
//                                             return (
//                                                 <div key={answer.answer_id} className="mb-2">
//                                                     <div className="flex items-center mb-1">
//                                                         <img
//                                                             src={answerUser?.profile_image}
//                                                             alt={answerUser?.full_name}
//                                                             className="w-8 h-8 rounded-full mr-2"
//                                                         />
//                                                         <p className="font-semibold">{answerUser?.full_name}</p>
//                                                     </div>
//                                                     <p className="text-sm">{answer.answer_text}</p>
//                                                     <p className="text-sm text-gray-500">
//                                                         Ngày trả lời: {answer.created_at}
//                                                     </p>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 ) : (
//                                     <p className="text-gray-500">Chưa có câu trả lời nào.</p>
//                                 )}
//                                 <button
//                                     className="text-blue-500 text-sm mt-2"
//                                     onClick={() => onReplyClick(course.course_id, question.question_id)}
//                                 >
//                                     Trả lời
//                                 </button>

//                                 {isReplyingToThisQuestion && (
//                                     <div className="mt-4">
//                                         <input
//                                             type="text"
//                                             value={replyText}
//                                             onChange={(e) => setReplyText(e.target.value)}
//                                             className="w-full p-2 border rounded-lg"
//                                         />
//                                         <div className="flex mt-2">
//                                             <button
//                                                 className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                                                 onClick={handleReplySubmit}
//                                             >
//                                                 Gửi
//                                             </button>
//                                             <button
//                                                 className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
//                                                 onClick={onCancelReply}
//                                             >
//                                                 Hủy
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })
//                 )}
//             </div>
//         </div>
//     );
// };
// export default CourseQA;