import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ManageFreeLectures = () => {
  const { id: courseId } = useParams();
  const token = localStorage.getItem("token");
  const [lectures, setLectures] = useState([]);
  const [editLectureId, setEditLectureId] = useState(null);
  const [editLectureData, setEditLectureData] = useState({
    title: "",
    videoUrl: "",
  });
  const [newLecture, setNewLecture] = useState({ title: "", videoUrl: "" });
  const [newLectureFile, setNewLectureFile] = useState(null);
  const [editLectureFile, setEditLectureFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/instructor/lectures-free/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLectures(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching lectures:", error);
      }
    };
    fetchLectures();
  }, [courseId, token]);
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        "http://localhost:8080/api/cloudinary/upload/video",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi upload image");
      }
      const imageUrl = await response.text();
      return imageUrl;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAddLecture = async () => {
    if (!newLecture.title || !newLectureFile) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
      });
      return;
    }
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn tạo bài học này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) return;
    try {
      setIsLoading(true);
      const uploadedUrl = await handleUpload(newLectureFile);
      const response = await axios.post(
        `http://localhost:8080/api/instructor/lectures-free`,
        { ...newLecture, videoUrl: uploadedUrl, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLectures([...lectures, response.data]);
      setNewLecture({ title: "", videoUrl: "" });
      setNewLectureFile(null);
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Lecture Added",
        text: "Lecture added successfully!",
      });
    } catch (error) {
      console.error("Error adding lecture:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add lecture.",
      });
      setIsLoading(false);
    }
  };

  const handleUpdateLecture = async (id) => {
    if (!editLectureData.title) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
      });
      return;
    }
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn lưu bài học này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) return;
    try {
      setIsLoading(true);
      let updatedVideoUrl = editLectureData.videoUrl;
      if (editLectureFile) {
        updatedVideoUrl = await handleUpload(editLectureFile);
      }
      const response = await axios.put(
        `http://localhost:8080/api/instructor/lectures-free`,
        { id, title: editLectureData.title, videoUrl: updatedVideoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLectures(
        lectures.map((lecture) => (lecture.id === id ? response.data : lecture))
      );
      setEditLectureId(null);
      setEditLectureData({ title: "", videoUrl: "" });
      setEditLectureFile(null);
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Lecture Updated",
        text: "Lecture updated successfully!",
      });
    } catch (error) {
      console.error("Error updating lecture:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update lecture.",
      });
      setIsLoading(false);
    }
  };

  const handleDeleteLecture = async (id) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn xóa bài học này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) return;
    try {
      setIsLoading(true);
      await axios.delete(
        `http://localhost:8080/api/instructor/lectures-free/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLectures(lectures.filter((lecture) => lecture.id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Lecture deleted successfully!",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting lecture:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete lecture.",
      });
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
          <p className="mt-4 text-blue-500 text-xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Free Lectures</h1>
      <p className="text-black-500 mb-6">
        Để thu hút học viên và giúp họ có cái nhìn tổng quan về khóa học, hãy
        thực hiện các bài học với các video miễn phí đê học viên có thể xem
        trước
      </p>
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Danh sách bài học miễn phí
        </h2>
        {lectures.length === 0 ? (
          <p className="text-gray-600">No lectures available.</p>
        ) : (
          <ul className="space-y-6">
            {lectures.map((lecture) => (
              <li
                key={lecture.id}
                className="flex flex-col sm:flex-row items-center justify-between w-full"
              >
                {editLectureId === lecture.id ? (
                  <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                    <input
                      type="text"
                      value={editLectureData.title}
                      onChange={(e) =>
                        setEditLectureData({
                          ...editLectureData,
                          title: e.target.value,
                        })
                      }
                      className="p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
                    />
                    <label className="cursor-pointer flex-1 p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center border border-dashed border-gray-300 rounded">
                      {editLectureFile
                        ? editLectureFile.name
                        : "Chọn file video"}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setEditLectureFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => handleUpdateLecture(lecture.id)}
                      className="text-green-600 hover:text-green-800 transition font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditLectureId(null);
                        setEditLectureFile(null);
                      }}
                      className="text-gray-600 hover:text-gray-800 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                    <div>
                      <h3 className="text-lg font-medium">{lecture.title}</h3>
                      <a
                        href={lecture.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Watch Video
                      </a>
                    </div>
                    <div className="mt-2 sm:mt-0 flex gap-4">
                      <button
                        onClick={() => {
                          setEditLectureId(lecture.id);
                          setEditLectureData({
                            title: lecture.title,
                            videoUrl: lecture.videoUrl,
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800 transition font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLecture(lecture.id)}
                        className="text-red-600 hover:text-red-800 transition font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Thêm mới bài học miễn phí</h2>
        <p className="text-gray-500 text-sm italic mb-4">
          Hãy đảm bảo bài học miễn phí bạn đăng gần giống với nối dung của khóa
          học của bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Tên bài học"
            value={newLecture.title}
            onChange={(e) =>
              setNewLecture({ ...newLecture, title: e.target.value })
            }
            className="p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          />
          <label className="cursor-pointer flex-1 p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center border border-dashed border-gray-300 rounded">
            {newLectureFile ? newLectureFile.name : "Chọn file video"}
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setNewLectureFile(e.target.files[0])}
              className="hidden"
            />
          </label>
          <button
            onClick={handleAddLecture}
            className="text-green-600 hover:text-green-800 transition font-semibold"
          >
            Thêm mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageFreeLectures;
