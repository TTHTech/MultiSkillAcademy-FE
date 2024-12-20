import React, { useState, useEffect } from "react";
import axios from "axios";

const LecturesFreeComponent = ({ courseId }) => {
  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState({ title: "", videoUrl: "" });
  const [editLecture, setEditLecture] = useState(null); // Lưu bài giảng đang chỉnh sửa
  const [loading, setLoading] = useState(false); // Trạng thái tải video
  const [isAdding, setIsAdding] = useState(false); // Trạng thái hiển thị form thêm bài giảng
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/instructor/lectures-free/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLectures(response.data);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };
    fetchLectures();
  }, [courseId, token]);

  const uploadVideo = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ImageUploat");
    formData.append("cloud_name", "due2txjv1");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/due2txjv1/video/upload",
        formData
      );
      setLoading(false);
      return response.data.secure_url;
    } catch (error) {
      setLoading(false);
      console.error("Error uploading the video", error);
      throw error;
    }
  };

  const handleAddLecture = async () => {
    if (!newLecture.title || !newLecture.videoUrl) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/instructor/lectures-free`,
        {
          ...newLecture,
          courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLectures([...lectures, response.data]);
      setNewLecture({ title: "", videoUrl: "" });
      setIsAdding(false); // Đóng form thêm
    } catch (error) {
      console.error("Error adding lecture:", error);
    }
  };

  // Update a lecture
  const handleUpdateLecture = async () => {
    if (!editLecture.title || !editLecture.videoUrl) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/instructor/lectures-free`,
        editLecture,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLectures(
        lectures.map((lecture) =>
          lecture.id === editLecture.id ? response.data : lecture
        )
      );
      setEditLecture(null); // Thoát chế độ chỉnh sửa
    } catch (error) {
      console.error("Error updating lecture:", error);
    }
  };

  // Delete a lecture
  const handleDeleteLecture = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/instructor/lectures-free/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLectures(lectures.filter((lecture) => lecture.id !== id));
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-white-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Manage Free Lectures
      </h1>

      {/* Button to show add form */}
      {!isAdding && !editLecture && (
        <button
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => setIsAdding(true)}
        >
          Add New Lecture
        </button>
      )}

      {/* Add Lecture Form */}
      {isAdding && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Lecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              className="border p-2 rounded-md w-full"
              placeholder="Lecture Title"
              value={newLecture.title}
              onChange={(e) =>
                setNewLecture({ ...newLecture, title: e.target.value })
              }
            />
            <input
              type="file"
              accept="video/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                try {
                  const videoUrl = await uploadVideo(file);
                  setNewLecture({ ...newLecture, videoUrl });
                } catch (error) {
                  console.error("Error uploading the video:", error);
                }
              }}
              className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
            />
            {loading && (
              <p className="text-blue-500 font-semibold">Uploading video...</p>
            )}
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleAddLecture}
            >
              Add Lecture
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => {
                setIsAdding(false);
                setNewLecture({ title: "", videoUrl: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Lecture Form */}
      {editLecture && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Lecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              className="border p-2 rounded-md w-full"
              value={editLecture.title}
              onChange={(e) =>
                setEditLecture({ ...editLecture, title: e.target.value })
              }
            />
            <input
              type="file"
              accept="video/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                try {
                  const videoUrl = await uploadVideo(file);
                  setEditLecture({ ...editLecture, videoUrl });
                } catch (error) {
                  console.error("Error uploading the video:", error);
                }
              }}
              className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
            />
            {loading && (
              <p className="text-blue-500 font-semibold">Uploading video...</p>
            )}
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={handleUpdateLecture}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => setEditLecture(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lecture List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lecture List</h2>
        <ul className="space-y-4">
          {lectures.map((lecture) => (
            <li
              key={lecture.id}
              className={`border p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center transition ${
                editLecture?.id === lecture.id ? "" : ""
              } hover:shadow-md`}
            >
              <div>
                <h3 className="font-bold text-gray-800">{lecture.title}</h3>
                <a
                  href={lecture.videoUrl}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </a>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  onClick={() => {
                    setEditLecture(lecture);
                    setIsAdding(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={() => {handleDeleteLecture(lecture.id);
                    setIsAdding(false);
                    setEditLecture(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LecturesFreeComponent;
