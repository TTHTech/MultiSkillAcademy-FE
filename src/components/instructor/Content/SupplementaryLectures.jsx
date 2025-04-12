import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const SupplementaryLectures = ({ courseId }) => {
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const token = localStorage.getItem("token");
  const [newLecture, setNewLecture] = useState({
    title: "",
    content_type: "",
    video_url: "",
    document_url: "",
  });
  const [pendingFileForNewLecture, setPendingFileForNewLecture] =
    useState(null);
  const [lectureToEdit, setLectureToEdit] = useState(null);
  const [editLectureData, setEditLectureData] = useState({
    title: "",
    content_type: "",
    video_url: "",
    document_url: "",
  });
  const [pendingFileForEdit, setPendingFileForEdit] = useState(null);
  const handleFileChangeForNewLecture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPendingFileForNewLecture(file);
      if (file.type.startsWith("video/")) {
        setNewLecture((prev) => ({ ...prev, content_type: "video" }));
      } else if (file.type === "application/pdf") {
        setNewLecture((prev) => ({ ...prev, content_type: "pdf" }));
      }
    }
  };
  const handleFileChangeForEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPendingFileForEdit(file);
      if (file.type.startsWith("video/")) {
        setEditLectureData((prev) => ({ ...prev, content_type: "video" }));
      } else if (file.type === "application/pdf") {
        setEditLectureData((prev) => ({ ...prev, content_type: "pdf" }));
      }
    }
  };
  const handleUploadVideo = async (file) => {
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
        throw new Error("Lỗi khi upload video");
      }
      const videoUrl = await response.text();
      return videoUrl;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUploadPdf = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        "http://localhost:8080/api/cloudinary/upload/pdf",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Lỗi khi upload PDF");
      }
      const pdfUrl = await response.text();
      return pdfUrl;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAddLecture = async () => {
    try {
      if (!newLecture.title || !pendingFileForNewLecture) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Vui lòng nhập tên bài học và tải file lên",
        });
        return;
      }

      setIsLoading(true);

      let uploadedUrl = "";
      if (pendingFileForNewLecture.type.startsWith("video/")) {
        uploadedUrl = await handleUploadVideo(pendingFileForNewLecture);
        setNewLecture((prev) => ({ ...prev, video_url: uploadedUrl }));
      } else if (pendingFileForNewLecture.type === "application/pdf") {
        uploadedUrl = await handleUploadPdf(pendingFileForNewLecture);
        setNewLecture((prev) => ({ ...prev, document_url: uploadedUrl }));
      }
      const nextLectureOrder =
        lectures.length > 0
          ? Math.max(...lectures.map((l) => l.lectureOrder || 0)) + 1
          : 1;
      const lecture_id = `${courseId}-${Date.now()}`;

      const newLectureData = {
        lecture_id,
        title: newLecture.title,
        content_type: newLecture.content_type,
        video_url: newLecture.content_type === "video" ? uploadedUrl : "",
        document_url: newLecture.content_type === "pdf" ? uploadedUrl : "",
        lectureOrder: nextLectureOrder,
      };

      await axios.post(
        `http://localhost:8080/api/instructor/supplementary/courses/${courseId}/lectures`,
        newLectureData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Tài liệu đã được thêm thành công.",
      });
      setNewLecture({
        title: "",
        content_type: "",
        video_url: "",
        document_url: "",
      });
      setPendingFileForNewLecture(null);
      fetchLectures();

      setIsLoading(false);
    } catch (error) {
      console.error("Error adding lecture", error);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Thêm tài liệu thất bại. Vui lòng thử lại.",
      });
    }
  };

  const handleEditLecture = async () => {
    if (!editLectureData.title) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập tên bài học",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có muốn lưu các thay đổi không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);

      let uploadedUrl = "";
      if (pendingFileForEdit) {
        if (pendingFileForEdit.type.startsWith("video/")) {
          uploadedUrl = await handleUploadVideo(pendingFileForEdit);
          editLectureData.video_url = uploadedUrl;
          editLectureData.document_url = "";
        } else if (pendingFileForEdit.type === "application/pdf") {
          uploadedUrl = await handleUploadPdf(pendingFileForEdit);
          editLectureData.document_url = uploadedUrl;
          editLectureData.video_url = "";
        }
      }

      const updatedLectureData = {
        lecture_id: lectureToEdit.lecture_id,
        title: editLectureData.title,
        content_type: editLectureData.content_type,
        video_url:
          editLectureData.content_type === "video"
            ? editLectureData.video_url
            : "",
        document_url:
          editLectureData.content_type === "pdf"
            ? editLectureData.document_url
            : "",
        lectureOrder: lectureToEdit.lectureOrder,
      };

      await axios.put(
        `http://localhost:8080/api/instructor/supplementary/lectures/${lectureToEdit.lecture_id}`,
        updatedLectureData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật tài liệu thành công.",
      });

      setLectureToEdit(null);
      setEditLectureData({
        title: "",
        content_type: "",
        video_url: "",
        document_url: "",
      });
      setPendingFileForEdit(null);
      fetchLectures();
    } catch (error) {
      console.error("Error updating lecture", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Cập nhật tài liệu thất bại. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLecture = async (lecture_id) => {
    try {
      const confirm = await Swal.fire({
        title: "Xóa bài học?",
        text: "Bạn có chắc chắn muốn xóa bài học này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
      });
      if (confirm.isConfirmed) {
        await axios.delete(
          `http://localhost:8080/api/instructor/supplementary/lectures/${lecture_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Lecture has been deleted.",
        });
        fetchLectures();
      }
    } catch (error) {
      console.error("Error deleting lecture", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete lecture.",
      });
    }
  };

  const fetchLectures = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/instructor/supplementary/courses/${courseId}/lectures`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLectures(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching supplementary lectures:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch supplementary lectures.",
      });
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [token, courseId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLectures = lectures.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(lectures.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
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
    <div className="min-h-screen p-8 bg-white">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Supplementary Lectures</h1>
      </div>
      <p className="text-gray-500 text-sm italic mb-4">
        Chú ý các tài liệu bạn đăng phài phù hợp với mội dung khóa học
      </p>
      {lectures.length === 0 ? (
        <p className="text-gray-600">No supplementary lectures available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentLectures.map((lecture) => (
              <div
                key={lecture.lecture_id}
                className="border rounded-md shadow-sm flex flex-col p-4 relative"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-medium truncate">
                    {lecture.title}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLectureToEdit(lecture);
                        setEditLectureData({
                          title: lecture.title,
                          content_type: lecture.content_type,
                          video_url: lecture.video_url,
                          document_url: lecture.document_url,
                        });
                      }}
                      title="Chỉnh sửa"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteLecture(lecture.lecture_id)}
                      title="Xóa"
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center mb-4">
                  {lecture.content_type === "video" ? (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 22v-20l18 10-18 10z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6M9 8h6m2 12H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v13a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-auto text-center">
                  {lecture.content_type === "video" ? (
                    <a
                      href={lecture.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                    >
                      Watch Video
                    </a>
                  ) : (
                    <a
                      href={lecture.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
                    >
                      View Document
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`py-2 px-4 rounded ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Previous
            </button>
            <span className="py-2 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`py-2 px-4 rounded ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Form thêm mới */}
      <h1 className="text-lg font-semibold mt-4">Thêm tài liệu mới</h1>
      <p className="text-gray-500 text-sm italic mb-2">
        Hãy đảm bảo nội dung tài liệu có nội dung phù hợp khóa học.
      </p>
      <div className="flex flex-col gap-4 p-4 border rounded-md">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-2/3">
            <label className="block text-gray-700 font-bold">Tên bài học</label>
            <p className="text-gray-500 text-sm italic">
              Nhập tên tài liệu sao cho ngắn gọn và dễ hiểu.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Tên bài học"
            value={newLecture.title}
            onChange={(e) =>
              setNewLecture({ ...newLecture, title: e.target.value })
            }
            className="p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 w-2/3"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div>
            <label className="block text-gray-700 font-bold">Tải file</label>
            <p className="text-gray-500 text-sm italic">
              Hãy tải lên nội dung của tài liệu.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label className="cursor-pointer flex-1 p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center border border-dashed border-gray-300 rounded">
            {pendingFileForNewLecture
              ? pendingFileForNewLecture.name
              : "Chọn Video hoặc PDF"}
            <input
              type="file"
              accept="video/*,application/pdf"
              onChange={handleFileChangeForNewLecture}
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

      {lectureToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => {
              setLectureToEdit(null);
              setPendingFileForEdit(null);
            }}
          ></div>
          <div className="relative bg-white rounded-xl shadow-xl p-8 w-11/12 max-w-lg z-10">
            <h1 className="text-2xl font-bold text-center mb-6">
              Chỉnh sửa tài liệu
            </h1>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tên bài học
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên bài học"
                  value={editLectureData.title}
                  onChange={(e) =>
                    setEditLectureData({
                      ...editLectureData,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tải file (Video hoặc PDF)
                </label>
                <label className="cursor-pointer flex items-center justify-between p-3 bg-gray-50 border border-dashed border-gray-300 rounded-md hover:bg-gray-100">
                  <span className="text-gray-600 truncate w-10/12">
                    {pendingFileForEdit
                      ? pendingFileForEdit.name
                      : (editLectureData.content_type === "video"
                          ? editLectureData.video_url
                          : editLectureData.document_url) ||
                        "Chọn Video hoặc PDF"}
                  </span>
                  <span className="text-blue-600 font-medium">Chọn File</span>
                  <input
                    type="file"
                    accept="video/*,application/pdf"
                    onChange={handleFileChangeForEdit}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleEditLecture}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-semibold transition duration-200"
                >
                  Lưu chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    setLectureToEdit(null);
                    setPendingFileForEdit(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md font-semibold transition duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplementaryLectures;
