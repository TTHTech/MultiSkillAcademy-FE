import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import Swal from "sweetalert2";

const QuestionTable = ({
  courses,
  questions,
  setQuestions,
  handleReplyClick,
  handleCancelReply,
  replyingTo,
  replyText,
  setReplyText,
  handleReplySubmit,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOptionsOpen, setIsFilterOptionsOpen] = useState(false);

  const toggleFilterOptions = () => {
    setIsFilterOptionsOpen(!isFilterOptionsOpen);
  };
  const toggleAnswers = (questionsId) => {
    setExpandedQuestionId(
      expandedQuestionId === questionsId ? null : questionsId
    );
  };

  const handleEvaluateChange = async (questionsId, answersId, newEvaluate) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn chuyển đổi trạng thái của câu trả lời này ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionsId === questionsId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.answersId === answersId
                  ? { ...answer, evaluate: newEvaluate }
                  : answer
              ),
            }
          : question
      )
    );

    fetch(`https://educoresystem-1.onrender.com/api/instructor/evaluateAnswer/${answersId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ evaluate: newEvaluate }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
        return Swal.fire({
          title: "Confirmation",
          text: "Sửa đổi trạng thái câu trả lời thành công",
          icon: "success",
          confirmButtonText: "Yes",
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        return Swal.fire({
          title: "Confirmation",
          text: "Sửa đổi trạng thái câu trả lời không thành công",
          icon: "error",
          confirmButtonText: "Yes",
        });
      });
  };

  const handleDeleteAnswer = async (questionsId, answersId) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn xóa câu trả lời này ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    try {
      await fetch(
        `https://educoresystem-1.onrender.com/api/instructor/deleteAnswer/${answersId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.questionsId === questionsId
            ? {
                ...question,
                answers: question.answers.filter(
                  (answer) => answer.answersId !== answersId
                ),
              }
            : question
        )
      );
      await Swal.fire({
        title: "Confirmation",
        text: "Xóa câu trả lời thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });
      console.log(`Deleted answer with ID: ${answersId}`);
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };
  const handleDeleteQuestion = async (questionsId) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn xóa câu hỏi này ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    try {
      await fetch(
        `https://educoresystem-1.onrender.com/api/instructor/deleteQuestion/${questionsId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.questionsId !== questionsId)
      );
      await Swal.fire({
        title: "Confirmation",
        text: "Xóa câu hỏi thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });
      console.log(`Deleted question with ID: ${questionsId}`);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const filteredCourses = courses.filter((course) => {
    let matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-none mx-4 p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý câu hỏi khóa học</h1>

      <div className="w-full max-w-none mx-4 p-6">
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded-md w-full text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by course name"
              />
            </div>

            <button
              onClick={toggleFilterOptions}
              className="bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300 flex items-center"
            >
              Filter Options
              {isFilterOptionsOpen ? (
                <ChevronUpIcon className="ml-2 h-5 w-5" />
              ) : (
                <ChevronDownIcon className="ml-2 h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {filteredCourses.map((course) => {
        const courseQuestions = questions.filter(
          (question) => question.courseId === course.courseId
        );

        return (
          <div
            key={course.courseId}
            className="mb-8 p-4 bg-gradient-to-b from-purple-100 to-blue-200 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
              {course.title}
            </h2>
            <table className="min-w-full bg-white border rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Asked By
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Answers
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courseQuestions.map((question) => {
                  const isExpanded =
                    expandedQuestionId === question.questionsId;
                  const isReplyingToThisQuestion =
                    replyingTo &&
                    replyingTo.questionId === question.questionsId;

                  return (
                    <React.Fragment key={question.questionsId}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{question.questionText}</td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4">
                          {moment(question.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td className="px-6 py-4">{question.answers.length}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-4">
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-all"
                              onClick={() =>
                                toggleAnswers(question.questionsId)
                              }
                            >
                              {isExpanded ? "Hide Answers" : "Show Answers"}
                            </button>
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-all"
                              onClick={() =>
                                handleReplyClick(
                                  course.courseId,
                                  question.questionsId
                                )
                              }
                            >
                              Reply
                            </button>
                            <button
                              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-all"
                              onClick={() =>
                                handleDeleteQuestion(question.questionsId)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="5">
                            <div className="bg-gray-100 p-4">
                              {question.answers.length > 0 ? (
                                question.answers.map((answer) => {
                                  const evaluateColor =
                                    answer.evaluate === "Unknown"
                                      ? "text-gray-500"
                                      : answer.evaluate === "Correct"
                                      ? "text-green-500"
                                      : "text-red-500";
                                  return (
                                    <div
                                      key={answer.answersId}
                                      className="mb-4 pb-2"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-gray-600 mb-1">
                                          {answer.answersText}
                                        </p>
                                        <button
                                          className="text-red-500 text-xs hover:text-red-700 transition-all"
                                          onClick={() =>
                                            handleDeleteAnswer(
                                              question.questionsId,
                                              answer.answersId
                                            )
                                          }
                                        >
                                          Delete Answer
                                        </button>
                                      </div>
                                      <div className="flex items-center text-xs">
                                        <p
                                          className={`font-semibold ${evaluateColor}`}
                                        >
                                          Đánh giá: {answer.evaluate}
                                        </p>
                                        {answer.userId !== "U001" && (
                                          <div className="ml-2">
                                            <button
                                              className="text-green-500 hover:text-green-600 transition-all"
                                              onClick={() =>
                                                handleEvaluateChange(
                                                  question.questionsId,
                                                  answer.answersId,
                                                  "Correct"
                                                )
                                              }
                                            >
                                              Đúng
                                            </button>
                                            <button
                                              className="text-red-500 hover:text-red-600 ml-2 transition-all"
                                              onClick={() =>
                                                handleEvaluateChange(
                                                  question.questionsId,
                                                  answer.answersId,
                                                  "Incorrect"
                                                )
                                              }
                                            >
                                              Sai
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        Ngày trả lời:{" "}
                                        {moment(answer.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </p>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-center text-gray-500">
                                  Chưa có câu trả lời nào.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                      {isReplyingToThisQuestion && (
                        <tr>
                          <td colSpan="5" className="bg-gray-50 p-4">
                            <div className="flex flex-col space-y-3">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Enter your reply here"
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
                                  onClick={handleReplySubmit}
                                >
                                  Submit
                                </button>
                                <button
                                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                                  onClick={handleCancelReply}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {courseQuestions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      Không có câu hỏi nào cho khóa học này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionTable;
