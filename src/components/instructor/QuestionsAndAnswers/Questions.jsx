import React, { useEffect, useState } from "react";
import axios from "axios";

const DetailQuestions = ({courseId}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
  }, []);

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {questions.map((question) => (
        <div
          key={question.questionsId}
          className="flex items-start space-x-4 p-4 border-b border-gray-300"
        >
          {/* Avatar */}
          <img
            src={question.userImage}
            alt={question.userName}
            className="w-12 h-12 rounded-full object-cover"
          />

          {/* Question Content */}
          <div className="flex-1">
            {/* User Name */}
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {question.userName}
            </h2>

            {/* Question Text */}
            <p className="text-gray-600 mt-1">{question.questionText}</p>

            {/* Metadata */}
            <div className="text-sm text-gray-500 mt-2">
              <span>
                {new Date(question.createdAt).toLocaleDateString()} • {" "}
              </span>
              <span>{question.totalAnswers} answers</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailQuestions;
