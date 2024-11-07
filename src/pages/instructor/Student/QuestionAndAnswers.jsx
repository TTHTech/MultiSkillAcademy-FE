import { useState } from 'react';
import moment from 'moment';

const initialData = [
  {
    questionsId: '1',
    courseId: '101',
    userId: '22',
    questionText: 'How does this topic work?',
    createdAt: new Date().toISOString(),
    answers: [
      {
        answersId: '1-1',
        questionId: '1',
        userId: '22',
        answersText: 'This is my understanding.',
        createdAt: new Date().toISOString(),
        evaluate: 'Good',
      },
      {
        answersId: '1-2',
        questionId: '1',
        userId: '33',
        answersText: 'I think it could be improved.',
        createdAt: new Date().toISOString(),
        evaluate: 'Average',
      },
    ],
  },
  {
    questionsId: '2',
    courseId: '101',
    userId: '33',
    questionText: 'Can you explain more about this?',
    createdAt: new Date().toISOString(),
    answers: [
      {
        answersId: '2-1',
        questionId: '2',
        userId: '22',
        answersText: 'Sure, here’s an answer.',
        createdAt: new Date().toISOString(),
        evaluate: 'Excellent',
      },
    ],
  },
];
const userID = "22"; 

const QuestionsAndAnswers = () => {
  const [questions, setQuestions] = useState(initialData);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

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
    const newQuestion = {
      questionsId: Math.random().toString(),
      courseId: '101',
      userId: '22',
      questionText: 'New question text',
      createdAt: new Date().toISOString(),
      answers: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleAddAnswer = (questionId) => {
    const newAnswer = {
      answersId: Math.random().toString(),
      questionId,
      userId: '22',
      answersText: 'New answer text',
      createdAt: new Date().toISOString(),
      evaluate: 'Pending',
    };
    setQuestions(questions.map((q) =>
      q.questionsId === questionId
        ? { ...q, answers: [...q.answers, newAnswer] }
        : q
    ));
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
                      <p className={`font-semibold ${answer.evaluate === 'Good' ? 'text-green-500' : 'text-yellow-500'}`}>
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
    </div>
  );
};

export default QuestionsAndAnswers;
