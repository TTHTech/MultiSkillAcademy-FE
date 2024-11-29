import { useState, useEffect } from "react";
import Sidebar from "../../components/instructor/Sidebar/Sidebar";
import QuestionTable from "../../components/instructor/QuestionsAndAnswers/TableQ&A";
import Swal from "sweetalert2";

const userId = Number(localStorage.getItem("userId"));
const CoursesWithUsersQA = () => {
  const [open, setOpen] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/instructor/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
          }
        );
        const data = await response.json();
        setInstructor(userId);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };
    fetchCourses();
  }, []);
  const[instructor, setInstructor] = useState([]);

  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/instructor/questions/${userId}`,
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

  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const handleReplyClick = (courseId, questionId) => {
    setReplyingTo({ courseId, questionId });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleReplySubmit = async () => {
    if (!replyingTo || replyText.trim() === "") return;

    const newAnswer = {
      answersId: `A${Math.random().toString().slice(2)}`,
      questionId: replyingTo.questionId,
      userId: instructor,
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
          question.questionsId === replyingTo.questionId
            ? { ...question, answers: [...question.answers, newAnswer] }
            : question
        )
      );
      await Swal.fire({
        title: "Confirmation",
        text: "Thêm câu trả lời thành công",
        icon: "success",
        confirmButtonText: "Yes",
      });
      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };

  return (
    <section
      className={`flex-1 m-4 p-4 duration-300 font-semibold text-xl text-gray-900 ${
        open ? "ml-72" : "ml-16"
      } bg-gradient-to-b from-gray-100 to-blue-100`}
    >
      <div>
        <QuestionTable
          courses={courses}
          questions={questions}
          instructor={instructor}
          handleReplyClick={handleReplyClick}
          handleCancelReply={handleCancelReply}
          replyingTo={replyingTo}
          replyText={replyText}
          setReplyText={setReplyText}
          handleReplySubmit={handleReplySubmit}
          setQuestions={setQuestions}
        />
      </div>
      <Sidebar open={open} setOpen={setOpen} />
    </section>
  );
};
export default CoursesWithUsersQA;
