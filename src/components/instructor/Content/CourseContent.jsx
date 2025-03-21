import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const CourseContent = () => {
  const { id } = useParams();
  const [targetAudience, setTargetAudience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAudience, setNewAudience] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [course, setCourse] = useState(null);
  const [selectedAudience, setSelectedAudience] = useState(null);
  const audienceContainerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        audienceContainerRef.current &&
        !audienceContainerRef.current.contains(e.target)
      ) {
        setSelectedAudience(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
        setTargetAudience(data.courseContent || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);
  const handleSave = async (updatedAudience) => {
    const audienceToSave = updatedAudience || targetAudience;
    const instructorCoursesDetailDTO = {
      targetAudience: course.targetAudience,
      courseContent: audienceToSave,
      resourceDescription: course.resourceDescription,
      requirements: course.requirements,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/instructor/update-course-detail/${course.courseId}`,
        instructorCoursesDetailDTO,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      alert("Failed to update course: " + err.message);
    }
  };
  const handleAudienceChange = (index, value) => {
    const updated = [...targetAudience];
    updated[index] = value;
    setTargetAudience(updated);
    handleSave(updated);
  };
  const handleDelete = (index) => {
    const updated = targetAudience.filter((_, i) => i !== index);
    setTargetAudience(updated);
    handleSave(updated);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (index) => {
    if (draggedIndex === null) return;
    const updated = [...targetAudience];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setTargetAudience(updated);
    setDraggedIndex(null);
    handleSave(updated);
  };
  const handleAddNew = () => {
    if (newAudience.trim().length == 0) {
      alert("Nội dung không được để trống");
      return;
    }
    if (newAudience.trim().length > 160) {
      alert("Nội dung phải có tối đa 160 ký tự");
      return;
    }
    const updated = [...targetAudience, newAudience];
    setTargetAudience([...targetAudience, newAudience]);
    setNewAudience("");
    handleSave(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Course Content</h1>
      <p className="text-black-500">
        Các mô tả sau sẽ hiển thị công khai trên Trang tổng quan khóa học của
        bạn và sẽ tác động trực tiếp đến thành tích khóa học, đồng thời giúp học
        viên quyết định xem khóa học đó có phù hợp với họ hay không.
      </p>
      <p className="font-bold mt-8 mb-2">
        Nội dung khóa học của bạn bao gồm những gì?
      </p>
      <div ref={audienceContainerRef} className="space-y-3">
        {targetAudience.map((audience, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 p-2 border border-gray-300 rounded bg-white transition-all duration-300 ${
              selectedAudience === index
                ? "shadow-2xl transform scale-105 border-blue-400"
                : ""
            }`}
            onClick={() => setSelectedAudience(index)}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={() => handleDrop(index)}
          >
            <input
              type="text"
              value={audience}
              onChange={(e) => handleAudienceChange(index, e.target.value)}
              className="flex-1 outline-none border-none text-gray-700"
              placeholder="Nhập target audience (tối thiểu 160 ký tự)"
            />
            <span className="border border-purple-500 text-purple-500 rounded px-2 py-1 text-sm">
              {audience.length}
            </span>
            <button
              onClick={() => handleDelete(index)}
              className="border border-purple-500 text-purple-500 rounded px-2 py-1 hover:bg-purple-100 transition"
              title="Xóa"
            >
              🗑
            </button>
            <button
              className="border border-purple-500 text-purple-500 rounded px-2 py-1 hover:bg-purple-100 transition cursor-move"
              title="Kéo để thay đổi vị trí"
            >
              ☰
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">
          Thêm thông tin nội dung mà khóa học bạn có
        </h2>
        <p className="text-gray-500 text-sm italic mb-2">
          Hãy đảm bảo thông tin bạn thêm sẽ đúng với nối dung của khóa học
          của bạn.
        </p>
        <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded bg-white">
          <input
            type="text"
            value={newAudience}
            onChange={(e) => setNewAudience(e.target.value)}
            className="flex-1 outline-none border-none text-gray-700"
            placeholder="Nhập thông tin nội dung (tối đa 160 ký tự)"
          />
          <span className="border border-purple-500 text-purple-500 rounded px-2 py-1 text-sm">
            {newAudience.length}
          </span>
        </div>
        <button
          onClick={handleAddNew}
          className="border border-purple-500 text-purple-500 rounded px-2 py-1 hover:bg-purple-100 transition mt-2"
        >
          + Thêm mới nội dung
        </button>
      </div>
    </div>
  );
};

export default CourseContent;