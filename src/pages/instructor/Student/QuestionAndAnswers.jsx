import { useState, useEffect } from 'react';
import moment from 'moment';

const userID = "2"; 

const QuestionsAndAnswers = () => {
  const [questions, setQuestions] = useState([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/student/questions/CR001",
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
  }, []);

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.questionsId !== questionId));
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    setQuestions(questions.map((q) =>
      q.questionsId === questionId
        ? { ...q, answers: q.answers.filter((a) => a.answersId !== answerId) }
        : q
    ));
  };

  const handleAddQuestion = () => {
    setShowQuestionModal(true); 
  };

  const confirmAddQuestion = () => {
    const newQuestion = {
      questionsId: Math.random().toString(),
      courseId: '101',
      userId: userID,
      questionText: newQuestionText,
      createdAt: new Date().toISOString(),
      answers: [],
    };
    setQuestions([...questions, newQuestion]);
    setNewQuestionText('');
    setShowQuestionModal(false);
  };

  const handleAddAnswer = (questionId) => {
    setCurrentQuestionId(questionId);
    setShowAnswerModal(true);
  };

  const confirmAddAnswer = () => {
    const newAnswer = {
      answersId: Math.random().toString(),
      questionId: currentQuestionId,
      userId: userID,
      answersText: newAnswerText,
      createdAt: new Date().toISOString(),
      evaluate: 'Pending',
    };
    setQuestions(questions.map((q) =>
      q.questionsId === currentQuestionId
        ? { ...q, answers: [...q.answers, newAnswer] }
        : q
    ));
    setNewAnswerText('');
    setShowAnswerModal(false);
  };

  const toggleAnswers = (questionId) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Quản lý câu hỏi khóa học</h1>
      <button
        onClick={handleAddQuestion}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add Question
      </button>
      {questions.map((question) => (
        <div key={question.questionsId} className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{question.questionText}</h2>
          <p className="text-gray-600 mb-4">Asked on: {moment(question.createdAt).format("DD/MM/YYYY")}</p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => toggleAnswers(question.questionsId)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              {expandedQuestionId === question.questionsId ? "Hide Answers" : "Show Answers"}
            </button>
            {question.userId === userID && (
              <button
                onClick={() => handleDeleteQuestion(question.questionsId)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Delete Question
              </button>
            )}
          </div>
          {expandedQuestionId === question.questionsId && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Answers:</h3>
              <ul className="space-y-4">
                {question.answers.map((answer) => (
                  <li key={answer.answersId} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-700 mb-2">{answer.answersText}</p>
                    <p className="text-sm text-gray-500">
                      Answered on: {moment(answer.createdAt).format("DD/MM/YYYY")}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className={`font-semibold ${answer.evaluate === 'Correct' ? 'text-green-500' : 'text-red-500'}`}>
                        Evaluate: {answer.evaluate}
                      </p>
                      {answer.userId === userID && (
                        <button
                          onClick={() => handleDeleteAnswer(question.questionsId, answer.answersId)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Delete Answer
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleAddAnswer(question.questionsId)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Add Answer
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Modal for Adding Question */}
      {showQuestionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Enter Question</h2>
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />
            <button
              onClick={confirmAddQuestion}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowQuestionModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for Adding Answer */}
      {showAnswerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Enter Answer</h2>
            <input
              type="text"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />
            <button
              onClick={confirmAddAnswer}
              className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowAnswerModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsAndAnswers;
