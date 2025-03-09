import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Details from "./Details";
import Images from "./Images";
import Swal from "sweetalert2";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const languages = [
    "English",
    "Vietnamese",
    "Chinese",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Korean",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",
    "Hindi",
    "Bengali",
    "Swedish",
    "Dutch",
    "Greek",
    "Hebrew",
    "Turkish",
    "Thai",
  ];
  const [isEditing, setIsEditing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/instructor/courses/${id}`,
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
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const response = await fetch(
          "http://localhost:8080/api/instructor/categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCourse();
    fetchCategories();
  }, [id, refresh]);
  const handleTabChange = (tab) => {
    if (isEditing) {
      Swal.fire({
        title: "Cảnh báo",
        text: "Các thao tác sửa đổi của bạn có thể không được lưu.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Tiếp tục",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsEditing(false);
          setActiveTab(tab);
        }
      });
    } else {
      setActiveTab(tab);
    }
  };
  if (loading) return <p className="text-center mt-10 text-2xl">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-2xl text-red-500">Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-white-100 p-6 flex flex-col items-center">
      <div className="flex space-x-6 mb-6 text-3xl font-bold">
        <button
          className={`px-6 py-3 ${
            activeTab === "content"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "border-b-4 border-gray-300 text-gray-600"
          }`}
          onClick={() => handleTabChange("content")}
        >
          Nội dung
        </button>
        <button
          className={`px-6 py-3 ${
            activeTab === "images"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "border-b-4 border-gray-300 text-gray-600"
          }`}
          onClick={() => handleTabChange("images")}
        >
          Hình ảnh
        </button>
      </div>

      <div className="w-full max-w-5xl flex bg-white p-6">
        {activeTab === "content" && (
          <Details
            course={course}
            categories={categories}
            languages={languages}
            onEditingChange={setIsEditing}
            triggerRefresh={triggerRefresh}
          />
        )}
        {activeTab === "images" && (
          <Images
            images={course.images}
            courseId={course.courseId}
            triggerRefresh={triggerRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
