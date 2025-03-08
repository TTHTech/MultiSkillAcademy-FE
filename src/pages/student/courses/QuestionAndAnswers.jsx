import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const QuestionsAndAnswers = ({ courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const userID = localStorage.getItem("userId");
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/student/questions/${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching Questions: ", error);
      }
    };
    fetchQuestions();
  }, [courseId, refresh]);
  const triggerRefresh = () => setRefresh((prev) => !prev);
  const toggleExpandQuestion = (questionId) => {
    setExpandedQuestionId((prevId) =>
      prevId === questionId ? null : questionId
    );
  };
  const confirmAddAnswer = async (questionId) => {
    if (!newAnswerText || newAnswerText.trim() === "") return;

    const newAnswer = {
      answersId: `A${Math.floor(Math.random() * 100000)}`,
      questionId: questionId,
      userId: userID,
      answersText: newAnswerText,
      createdAt: new Date().toISOString(),
      evaluate: "Unknown",
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/student/add-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newAnswer),
        }
      );
      const data = await response.text();
      setNewAnswerText("");
      await Swal.fire({
        title: "Confirmation",
        text: "Thêm câu trả lời thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });
      triggerRefresh();
    } catch (error) {
      console.error("Error adding answer: ", error);
    }
  };
  const confirmAddQuestion = async () => {
    if (!newQuestionText || newQuestionText.trim() === "") return;
    const newQuestion = {
      questionsId: `Q${Math.floor(Math.random() * 100000)}`,
      courseId: courseId,
      userId: userID,
      questionText: newQuestionText,
      createdAt: new Date().toISOString(),
      answers: [],
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/student/add-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newQuestion),
        }
      );
      const data = await response.text();
      await Swal.fire({
        title: "Confirmation",
        text: "Thêm câu hỏi thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });
      triggerRefresh();
      setNewQuestionText("");
    } catch (error) {
      console.error("Error adding question: ", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn xóa câu hỏi này ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (!swalResult.isConfirmed) return;

    try {
      await fetch(
        `http://localhost:8080/api/student/delete-questions/${questionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await Swal.fire({
        title: "Confirmation",
        text: "Xóa câu hỏi thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });
      triggerRefresh();
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };
  const handleDeleteAnswer = async (questionId, answerId) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn xóa câu trả lời này ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (!swalResult.isConfirmed) return;

    try {
      await fetch(
        `http://localhost:8080/api/student/delete-answers/${answerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await Swal.fire({
        title: "Confirmation",
        text: "Xóa câu trả lời thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });
      triggerRefresh();
    } catch (error) {
      console.error("Error deleting answer: ", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white-50 mb-16 mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Hỏi đáp thắc mắc học tập
      </h1>
      <div className="mt-4">
        <textarea
          className="w-full border border-gray-300 p-2 rounded-lg"
          rows="2"
          placeholder="Nhập câu hỏi ..."
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
        ></textarea>
        <div className="flex justify-end space-x-2 mt-2">
          {/* <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            onClick={() => setNewQuestionText("")}
          >
            Clear
          </button> */}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={confirmAddQuestion}
          >
            Gửi
          </button>
        </div>
      </div>
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
                {userID == question.userId && (
                  <p
                    onClick={() => handleDeleteQuestion(question.questionsId)}
                    className="text-red-500 cursor-pointer"
                    style={{ marginLeft: "auto" }}
                  >
                    Delete
                  </p>
                )}
              </h2>
              <p className="text-gray-600 mt-1">{question.questionText}</p>
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <span>
                  {new Date(question.createdAt).toLocaleDateString()} •
                </span>
                <span
                  className="text-blue-500 cursor-pointer ml-2"
                  onClick={() => toggleExpandQuestion(question.questionsId)}
                >
                  {question.totalAnswers} câu trả lời
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
                  <h3 className="text-lg font-semibold text-gray-800 capitalize flex justify-between items-center">
                    <span className="text-sm text-gray-800">
                      {answer.userName} 
                      {answer.isInstructor == 1 && (
                        <span className="text-blue-500 font-bold"> (Giảng viên)</span>
                      )}
                    </span>
                    {userID == answer.userId && (
                      <span
                        onClick={() =>
                          handleDeleteAnswer(question.questionsId, answer.answersId)
                        }
                        className="text-red-500 cursor-pointer ml-auto"
                      >
                        Delete
                      </span>
                    )}
                  </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {answer.answersText}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(answer.createdAt).toLocaleDateString()} • 
                      <span
                        className={`font-semibold ${
                          {
                            Correct: "text-green-500",
                            Incorrect: "text-red-500",
                          }[answer.evaluate] || "text-gray-500"
                        }`}
                      >
                        {answer.evaluate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <textarea
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  rows="2"
                  placeholder="Nhập câu trả lời..."
                  value={newAnswerText}
                  onChange={(e) => setNewAnswerText(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    onClick={() => toggleExpandQuestion(question.questionsId)}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => confirmAddAnswer(question.questionsId)}
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

export default QuestionsAndAnswers;
