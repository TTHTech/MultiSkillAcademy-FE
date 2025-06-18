import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const DetailQuestions = ({ courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/instructor/detail-questions/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [courseId, token, refresh]);
  const triggerRefresh = () => setRefresh((prev) => !prev);
  const EVALUATE_LABELS = {
    Correct: "Đúng",
    Incorrect: "Sai",
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
      await fetch(`${baseUrl}/api/instructor/deleteQuestion/${questionsId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      triggerRefresh();
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
  const [replyText, setReplyText] = useState("");
  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    const newAnswer = {
      answersId: `A${Math.random().toString().slice(2)}`,
      questionId: expandedQuestionId,
      userId: userId,
      answersText: replyText,
      createdAt: new Date().toISOString(),
      evaluate: "Correct",
    };
    console.log("Câu trả lời vừa nhập:", newAnswer);

    try {
      await fetch(`${baseUrl}/api/instructor/addAnswer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAnswer),
      });
      triggerRefresh();
      await Swal.fire({
        title: "Confirmation",
        text: "Thêm câu trả lời thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });
      setReplyText("");
    } catch (error) {
      console.error("Error adding answer:", error);
    }
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
      await fetch(`${baseUrl}/api/instructor/deleteAnswer/${answersId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      triggerRefresh();
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
  const toggleAnswersVisibility = (questionsId) => {
    setExpandedQuestionId((prevId) =>
      prevId === questionsId ? null : questionsId
    );
  };
  const handleEvaluateChange = async (questionsId, answersId, newEvaluate) => {
    const newEvaluateLabel = EVALUATE_LABELS[newEvaluate] || newEvaluate;

    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: `Bạn có chắc chắn muốn chuyển trạng thái của câu trả lời này thành “${newEvaluateLabel}” không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });
    if (swalResult.isDismissed) {
      return;
    }
    fetch(`${baseUrl}/api/instructor/evaluateAnswer/${answersId}`, {
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
        triggerRefresh();
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
    triggerRefresh();
  };
  if (loading) {
    return <div className="text-center text-lg mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {questions.map((question) => (
        <div
          key={question.questionsId}
          className="p-4 border-b border-gray-300"
        >
          <div className="flex items-start gap-4 p-4 border-l-4 border-blue-500 rounded-lg shadow-md bg-white">
            <img
              src={question.userImage}
              alt={question.userName}
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {question.userName}
                </h2>
                <button
                  onClick={() => handleDeleteQuestion(question.questionsId)}
                  className="text-red-500 hover:text-red-700 transition-all duration-200 text-sm font-medium"
                >
                  Xóa
                </button>
              </div>
              <p className="text-gray-700 mt-2 leading-relaxed">
                {question.questionText}
              </p>
              <div className="text-sm text-gray-500 mt-3 flex items-center">
                <span>
                  {new Date(question.createdAt).toLocaleDateString()} •
                </span>
                <button
                  className="text-blue-500 hover:text-blue-700 font-medium transition-all duration-200 ml-2"
                  onClick={() => toggleAnswersVisibility(question.questionsId)}
                >
                  {question.totalAnswers} Câu trả lời
                </button>
              </div>
            </div>
          </div>

          {expandedQuestionId === question.questionsId && (
            <div className="mt-4 ml-16">
              {question.listAnswers.map((answer) => (
                <div
                  key={answer.answersId}
                  className="p-3 border-l-4 border-green-500 bg-gray-50 rounded-lg shadow-sm flex items-start gap-4 mb-2"
                >
                  <img
                    src={answer.userImage}
                    alt={answer.userName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900">
                      {answer.userName}
                    </h3>
                    <p className="text-gray-700 text-sm mt-1">
                      {answer.answersText}
                    </p>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <span>
                        {new Date(answer.createdAt).toLocaleDateString()} •{" "}
                      </span>
                      <span
                        onClick={() =>
                          handleEvaluateChange(
                            question.questionsId,
                            answer.answersId,
                            answer.evaluate === "Correct"
                              ? "Incorrect"
                              : "Correct"
                          )
                        }
                        className={`font-semibold cursor-pointer ml-2 transition-all ${
                          answer.evaluate === "Correct"
                            ? "text-green-600 hover:text-green-800"
                            : "text-red-500 hover:text-red-700"
                        }`}
                      >
                        {answer.evaluate === "Correct" ? "Đúng" : "Sai"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteAnswer(question.questionsId, answer.answersId)
                    }
                    className="text-red-500 text-sm hover:text-red-700 transition-all"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <div className="mt-4 bg-gray-50 p-3 rounded-lg shadow-sm">
                <textarea
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  rows="2"
                  placeholder="Nhập câu trả lời..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all"
                    onClick={() =>
                      toggleAnswersVisibility(question.questionsId)
                    }
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-all"
                    onClick={handleReplySubmit}
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DetailQuestions;
