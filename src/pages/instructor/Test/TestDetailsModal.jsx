import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const TestDetailsModal = ({ test, onClose, open }) => {
  const [testData, setTestData] = useState(test);
  const token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const [newAnswerCorrect, setNewAnswerCorrect] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  useEffect(() => {
    setTestData(test);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [test]);

  if (!testData) return null;
  const handleAddQuestion = async () => {
    if (!newQuestionText || newQuestionText.trim() === "") {
      await Swal.fire({
        title: "Thông báo",
        text: "Vui lòng nhập câu hỏi.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/instructor/addQuestion`,
        {
          text: newQuestionText,
          testId: testData.id,
          answers: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTestData((prev) => ({
        ...prev,
        questions: [...prev.questions, response.data],
      }));
      setNewQuestionText("");
      await Swal.fire({
        title: "Thành công",
        text: "Câu hỏi đã được thêm thành công.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error adding question:", error);
      await Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi thêm câu hỏi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleAddAnswer = async (questionId) => {
    if (!newAnswerText.trim()) {
      await Swal.fire({
        title: "Thông báo",
        text: "Vui lòng nhập câu trả lời.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/instructor/addAnswers`,
        {
          text: newAnswerText,
          questionId: questionId,
          isCorrect: newAnswerCorrect,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTestData((prev) => {
        const updatedQuestions = prev.questions.map((q) =>
          q.id === questionId
            ? { ...q, answers: [...q.answers, response.data] }
            : q
        );
        return { ...prev, questions: updatedQuestions };
      });

      handleCancelAddAnswer();
      await Swal.fire({
        title: "Thành công",
        text: "Câu trả lời đã được thêm thành công.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error adding answer:", error);
      await Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi thêm câu trả lời.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!testData.title.trim()) {
      await Swal.fire({
        title: "Thông báo",
        text: "Vui lòng nhập Tiêu Đề.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!testData.description.trim()) {
      await Swal.fire({
        title: "Thông báo",
        text: "Vui lòng nhập Mô Tả.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!testData.courseId.trim()) {
      await Swal.fire({
        title: "Thông báo",
        text: "Vui lòng chọn Mã Khóa Học.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/instructor/updateTest/${testData.id}`,
        {
          title: testData.title,
          description: testData.description,
          courseId: testData.courseId,
          duration: testData.duration,
          questionCount: testData.questionCount,
          correctAnswersRequired: testData.correctAnswersRequired,
          questions: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      await Swal.fire({
        title: "Thành công",
        text: "Cập nhật bài kiểm tra thành công.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating test:", error);
      await Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi cập nhật bài kiểm tra.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setTestData(test);
    setIsEditing(false);
  };
  const clodeForm = async () => {
    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Chú ý nếu bài kiểm tra không hợp lý sẽ không hiển thị cho học viên thực hiện.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    setIsEditing(false);
    onClose();
  };
  const handleDeleteTest = async () => {
    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa bài kiểm tra này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (swalResult.isDismissed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/instructor/deleteTest/${test.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire({
        title: "Thành công",
        text: "Xóa bài kiểm tra thành công.",
        icon: "success",
        confirmButtonText: "OK",
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting test:", error);
      await Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi xóa bài kiểm tra.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa câu hỏi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (swalResult.isDismissed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/instructor/deleteTestQuestion/${questionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await Swal.fire({
        title: "Thành công",
        text: "Xóa câu hỏi thành công.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTestData((prev) => {
        const updatedQuestions = prev.questions.filter(
          (q) => q.id !== questionId
        );
        return {
          ...prev,
          questions: updatedQuestions,
          questionCount: updatedQuestions.length,
        };
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      await Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi xóa câu hỏi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteAnswer = async (answerId, questionId) => {
    const swalResult = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa câu trả lời này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (swalResult.isDismissed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/instructor/deleteTestAnswers/${answerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire({
        title: "Thành công",
        text: "Xóa câu trả lời thành công.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setTestData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) }
            : q
        ),
      }));
    } catch (error) {
      console.error("Error deleting answer:", error);
      await Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi xóa câu trả lời.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleCancelAddAnswer = () => {
    setNewAnswerText("");
    setNewAnswerCorrect(false);
    setSelectedQuestionId(null);
  };
  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-4xl relative transition-all duration-300 ${
          open ? "ml-72" : "ml-0"
        } overflow-auto max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Tên bài kiểm tra
              </label>
              <input
                type="text"
                name="title"
                value={testData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Tiêu đề bài kiểm tra"
              />
              <label className="block text-sm font-semibold text-gray-700">
                Mô tả bài kiểm tra
              </label>
              <textarea
                name="description"
                value={testData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Mô tả bài kiểm tra"
                rows="3"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Số câu hỏi
                  </label>
                  <input
                    type="number"
                    name="questionCount"
                    value={testData.questionCount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Thời gian (phút)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={testData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Câu đúng yêu cầu
                  </label>
                  <input
                    type="number"
                    name="correctAnswersRequired"
                    value={testData.correctAnswersRequired}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400"
                  onClick={handleCancelEdit}
                >
                  Hủy
                </button>
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400"
                  onClick={handleSaveChanges}
                >
                  Lưu
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {testData.title}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Mô tả:</strong> {testData.description}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Thời gian:</strong> {testData.duration} phút
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Số câu hỏi:</strong> {testData.questionCount}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Câu hỏi yêu cầu đúng:</strong>{" "}
              {testData.correctAnswersRequired}
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-6 py-2 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300 flex items-center space-x-2"
                onClick={() => setIsEditing(true)}
              >
                <span>Chỉnh sửa</span>
              </button>
              <button
                className="px-6 py-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-300 flex items-center space-x-2"
                onClick={handleDeleteTest}
              >
                <span>Xóa bài kiểm tra</span>
              </button>
            </div>
          </>
        )}
        <div className="mt-8 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Thêm câu hỏi</h3>
          <input
            type="text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            placeholder="Nhập câu hỏi mới"
          />
          <button
            onClick={handleAddQuestion}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm câu hỏi
          </button>
        </div>

        <ul className="mt-6 space-y-4">
          {testData.questions.map((q) => {
            const correctAnswersCount = q.answers.filter(
              (a) => a.isCorrect
            ).length;
            const questionBgColor =
              correctAnswersCount === 0 || correctAnswersCount > 1
                ? "bg-red-100"
                : "bg-gray-50";

            return (
              <li
                key={q.id}
                className={`${questionBgColor} p-4 rounded-lg shadow-md`}
              >
                <div className="flex justify-between items-center">
                  <strong className="text-blue-700">{q.text}</strong>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    Xóa câu hỏi
                  </button>
                </div>
                <ul className="mt-2 space-y-2 pl-4">
                  {q.answers.map((a) => {
                    const answerTextColor = a.isCorrect
                      ? "text-green-700 font-semibold"
                      : "text-gray-800";

                    return (
                      <li
                        key={a.id}
                        className={`flex justify-between items-center ${answerTextColor}`}
                      >
                        <span>{a.text}</span>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteAnswer(a.id, q.id)}
                        >
                          Xóa câu trả lời
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {selectedQuestionId === q.id && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Thêm câu trả lời
                    </h3>
                    <input
                      type="text"
                      value={newAnswerText}
                      onChange={(e) => setNewAnswerText(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      placeholder="Nhập câu trả lời mới"
                    />
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-700">Đúng</label>
                      <input
                        type="checkbox"
                        checked={newAnswerCorrect}
                        onChange={() => setNewAnswerCorrect(!newAnswerCorrect)}
                        className="h-4 w-4 text-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() => handleAddAnswer(q.id)}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Thêm câu trả lời
                      </button>
                      <button
                        onClick={handleCancelAddAnswer}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
                {!selectedQuestionId && (
                  <button
                    onClick={() => setSelectedQuestionId(q.id)}
                    className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Thêm câu trả lời
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center space-x-2"
            onClick={() => clodeForm()}
          >
            <span>✖</span>
            <span>Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsModal;
