import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const DetailQuestions = ({ courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/instructor/detail-questions/${courseId}`,
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
  }, [courseId, token, questions]);

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
        `http://localhost:8080/api/instructor/deleteQuestion/${questionsId}`,
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
  const [replyText, setReplyText] = useState("");

  const handleCancelReply = () => {
    setReplyText("");
  };
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
      await fetch("http://localhost:8080/api/instructor/addAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAnswer),
      });

      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.questionsId === expandedQuestionId
            ? {
                ...question,
                listAnswers: [...question.listAnswers, newAnswer],
                totalAnswers: question.totalAnswers + 1,
              }
            : question
        )
      );
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
      await fetch(
        `http://localhost:8080/api/instructor/deleteAnswer/${answersId}`,
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
                listAnswers: question.listAnswers.filter(
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
  const toggleAnswersVisibility = (questionsId) => {
    setExpandedQuestionId((prevId) =>
      prevId === questionsId ? null : questionsId
    );
  };
  const handleEvaluateChange = async (questionsId, answersId, newEvaluate) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: `Bạn có chắc chắn muốn chuyển đổi trạng thái của câu trả lời này thành ` + `${newEvaluate}` + ` hay không ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }


    fetch(`http://localhost:8080/api/instructor/evaluateAnswer/${answersId}`, {
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
          <div className="flex items-start space-x-4">
            <img
              src={question.userImage}
              alt={question.userName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 capitalize flex justify-between items-center">
                <span>{question.userName}</span>
                <p
                  onClick={() => handleDeleteQuestion(question.questionsId)}
                  className="text-red-500 cursor-pointer"
                  style={{ marginLeft: "auto" }}
                >
                  Delete
                </p>
              </h2>
              <p className="text-gray-600 mt-1">{question.questionText}</p>
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <span>
                  {new Date(question.createdAt).toLocaleDateString()} •
                </span>
                <span
                  className="text-blue-500 cursor-pointer ml-2"
                  onClick={() => toggleAnswersVisibility(question.questionsId)}
                >
                  {question.totalAnswers} answers
                </span>
              </div>
            </div>
          </div>
          {expandedQuestionId === question.questionsId && (
            <div className="mt-4 ml-16">
              {question.listAnswers.map((answer) => (
                <div
                  key={answer.answersId}
                  className="p-2 border-b border-gray-200 flex items-start space-x-4"
                >
                  <img
                    src={answer.userImage}
                    alt={answer.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800">
                      {answer.userName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {answer.answersText}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(answer.createdAt).toLocaleDateString()} •{" "}
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
                        className={`font-semibold cursor-pointer ${
                          answer.evaluate === "Correct"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {answer.evaluate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p
                      onClick={() =>
                        handleDeleteAnswer(
                          question.questionsId,
                          answer.answersId
                        )
                      }
                      className="text-red-500 cursor-pointer text-sm"
                    >
                      Delete
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <textarea
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  rows="2"
                  placeholder="Nhập câu trả lời..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    onClick={handleCancelReply}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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
