import React, { Fragment } from 'react';
// import { getUserById } from './utils'; // Tạo hàm lấy user theo user_id nếu cần

const FilteredCourseTable = ({
  course,
  questions,
  expandedQuestionId,
  toggleAnswers,
  handleReplyClick,
  handleDeleteQuestion,
  getUserById,
  handleEvaluateChange,
  handleDeleteAnswer,
  replyingTo,
  replyText,
  setReplyText,
  handleReplySubmit,
  handleCancelReply
}) => {
  const courseQuestions = questions.filter((question) => question.course_id === course.course_id);

  return (
    <div className="mb-8 p-4 bg-gradient-to-b from-red-300 to-blue-400 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">{course.title}</h2>
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Question</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Asked By</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Answers</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courseQuestions.map((question) => {
            const user = getUserById(question.user_id);
            const isExpanded = expandedQuestionId === question.question_id;
            const isReplyingToThisQuestion = replyingTo && replyingTo.questionId === question.question_id;

            return (
              <Fragment key={question.question_id}>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{question.question_text}</td>
                  <td className="px-6 py-4">{user ? user.full_name : "Unknown"}</td>
                  <td className="px-6 py-4">{question.created_at}</td>
                  <td className="px-6 py-4">{question.answers.length}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-all"
                        onClick={() => toggleAnswers(question.question_id)}
                      >
                        {isExpanded ? "Hide Answers" : "Show Answers"}
                      </button>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-all"
                        onClick={() => handleReplyClick(course.course_id, question.question_id)}
                      >
                        Reply
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-all"
                        onClick={() => handleDeleteQuestion(question.question_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan="5">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {question.answers.length > 0 ? (
                          question.answers.map((answer) => {
                            const answerUser = getUserById(answer.user_id);
                            const evaluateColor =
                              answer.evaluate === "Unknown"
                                ? "text-gray-500"
                                : answer.evaluate === "Correct"
                                ? "text-green-500"
                                : "text-red-500";

                            return (
                              <div key={answer.answer_id} className="mb-4 border-b pb-4">
                                <div className="flex items-center mb-2">
                                  <img
                                    src={answerUser?.avatar_url}
                                    alt={`${answerUser?.full_name}'s avatar`}
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                  <span className="text-gray-700 font-semibold">
                                    {answerUser?.full_name || "Unknown"}
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-2">{answer.answer_text}</p>
                                <p className={`font-semibold ${evaluateColor}`}>
                                  {answer.evaluate === "Correct"
                                    ? "Correct Answer"
                                    : answer.evaluate === "Incorrect"
                                    ? "Incorrect Answer"
                                    : "Not Evaluated"}
                                </p>
                                <div className="flex space-x-4 mt-2">
                                  <button
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 transition-all"
                                    onClick={() =>
                                      handleEvaluateChange(question.question_id, answer.answer_id, "Correct")
                                    }
                                  >
                                    Mark Correct
                                  </button>
                                  <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-all"
                                    onClick={() =>
                                      handleEvaluateChange(question.question_id, answer.answer_id, "Incorrect")
                                    }
                                  >
                                    Mark Incorrect
                                  </button>
                                  <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-all"
                                    onClick={() => handleDeleteAnswer(question.question_id, answer.answer_id)}
                                  >
                                    Delete Answer
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-gray-500">No answers yet.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {isReplyingToThisQuestion && (
                  <tr>
                    <td colSpan="5">
                      <div className="p-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="border w-full p-2 rounded-md"
                          placeholder="Type your reply here..."
                        />
                        <div className="flex justify-end space-x-4 mt-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-all"
                            onClick={handleReplySubmit}
                          >
                            Submit Reply
                          </button>
                          <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-all"
                            onClick={handleCancelReply}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FilteredCourseTable;
