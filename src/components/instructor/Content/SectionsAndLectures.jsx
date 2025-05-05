import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sections from "./Sections";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const SectionsAndLectures = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/instructor/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-100 p-6">
      <h1 className="text-3xl font-bold mb-2">Sections And Lectures</h1>
      <p className="text-gray-500 text-sm italic">
        Danh sách các chương và các bài học của từng chương. Đây là nội dung mà
        học viên sẽ được học từ khóa học của bạn. Nội dung của các bài học có
        thể là Video giảng dạy hoặc file tài liệu PDF
      </p>
      {course && course.sections ? (
        <Sections sections={course.sections} />
      ) : (
        <p className="text-gray-500">No sections available.</p>
      )}
    </div>
  );
};

export default SectionsAndLectures;
