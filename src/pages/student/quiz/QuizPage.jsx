import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import QuizSidebar from "../../../components/student/Quiz/QuizSidebar";
import QuizQuestionSection from "../../../components/student/Quiz/QuizQuestionSection";
import QuizNavigation from "../../../components/student/Quiz/QuizNavigation";
import { useParams, useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const QuizPage = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null); // Điểm cuối cùng
  const [isScoreSaved, setIsScoreSaved] = useState(false); // Trạng thái lưu điểm
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/student/course/test/${id}`
        );
        const data = response.data;

        setQuizData(data);
        setAnswers(
          data.questions.map(() => ({ selectedAnswer: null, isCorrect: false }))
        );
        setTimeLeft(data.duration * 60);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu bài kiểm tra");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
        }
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswer = (index, answer) => {
    setAnswers((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              selectedAnswer: answer,
              isCorrect:
                quizData.questions[index].answers.find((a) => a.text === answer)
                  ?.isCorrect || false,
            }
          : item
      )
    );
  };

  const handleFinish = () => {
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
    const totalQuestions = quizData.questions.length;
    const finalScore = (correctAnswers / totalQuestions) * 10;
    setScore(finalScore.toFixed(2)); // Điểm trên thang 10
  };

  const handleSaveScore = async () => {
    if (!quizData || isScoreSaved) return;

    const payload = {
      id: null,
      courseId: quizData.courseId,
      userId: userId,
      testId: id,
      score: parseFloat(score),
      testDate: new Date(),
    };

    try {
      await axios.post(`${baseUrl}/api/student/scores`, payload);
      setIsScoreSaved(true);
      alert("Lưu điểm thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu điểm:", err);
      alert("Lưu điểm thất bại!");
    }
  };

  const handleNext = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!quizData) return <div>Không có dữ liệu bài kiểm tra</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mt-[90px]">
      <NavBar />

      <div className="flex flex-1 justify-center p-8 flex-row-reverse">
        <QuizSidebar
          questions={quizData.questions}
          currentQuestionIndex={currentQuestionIndex}
          onSelectQuestion={handleSelectQuestion}
          onFinish={handleFinish}
        />

        <div className="flex-1 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
          {score !== null ? (
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-green-600">
                Điểm của bạn: {score}/10
              </div>
              <div className="flex justify-center items-center space-x-1">
              <button
                  onClick={handleSaveScore}
                  className={`py-2 px-6 text-white text-lg font-semibold rounded-md ${
                    isScoreSaved
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isScoreSaved}
                >
                  {isScoreSaved ? "Đã lưu điểm" : "Lưu điểm"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="py-2 px-6 text-white text-lg font-semibold rounded-md bg-red-500 hover:bg-red-600"
                >
                  <span>Quay lại</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-semibold">
                  Thời gian còn lại: {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </div>
              </div>

              <QuizQuestionSection
                question={quizData.questions[currentQuestionIndex].text}
                options={quizData.questions[currentQuestionIndex].answers.map(
                  (a) => a.text
                )}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={quizData.questions.length}
                selectedAnswer={answers[currentQuestionIndex].selectedAnswer}
                onAnswer={handleAnswer}
              />

              <QuizNavigation
                onNext={handleNext}
                onPrev={handlePrev}
                isLastQuestion={
                  currentQuestionIndex === quizData.questions.length - 1
                }
                isFirstQuestion={currentQuestionIndex === 0}
              />
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuizPage;
