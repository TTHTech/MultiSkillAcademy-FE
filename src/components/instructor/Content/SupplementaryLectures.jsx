import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2 } from "react-icons/fi";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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
      } else {
        const fileTypeInfo = getFileTypeInfo(file);
        setEditLectureData((prev) => ({
          ...prev,
          content_type: fileTypeInfo.type,
        }));
      }
    }
  };

  const handleUploadVideo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        `${baseUrl}/api/cloudinary/upload/video`,
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
        `${baseUrl}/api/cloudinary/upload/pdf`,
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
  const getFileTypeInfo = (file) => {
    if (file.type.startsWith("video/")) {
      return { type: "video", urlField: "video_url" };
    } else {
      const ext = file.name.split(".").pop().toLowerCase();
      return { type: ext, urlField: "document_url" };
    }
  };
  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        `${baseUrl}/api/cloudinary/upload/raw`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Lỗi khi upload file");
      }
      const fileUrl = await response.text();
      return fileUrl;
    } catch (error) {
      console.error("Error:", error);
      throw error;
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
      const uploadedUrl = await handleUploadFile(pendingFileForNewLecture);
      if (!uploadedUrl) {
        Swal.fire({
          icon: "error",
          title: "Upload Error",
          text: "File upload failed. Please try again.",
        });
        return;
      }
      const fileTypeInfo = getFileTypeInfo(pendingFileForNewLecture);
      setNewLecture((prev) => ({
        ...prev,
        content_type: fileTypeInfo.type,
        video_url: fileTypeInfo.urlField === "video_url" ? uploadedUrl : "",
        document_url:
          fileTypeInfo.urlField === "document_url" ? uploadedUrl : "",
      }));

      const nextLectureOrder =
        lectures.length > 0
          ? Math.max(...lectures.map((l) => l.lectureOrder || 0)) + 1
          : 1;
      const lecture_id = `${courseId}-${Date.now()}`;

      const newLectureData = {
        lecture_id,
        title: newLecture.title,
        content_type: fileTypeInfo.type,
        video_url: fileTypeInfo.urlField === "video_url" ? uploadedUrl : "",
        document_url:
          fileTypeInfo.urlField === "document_url" ? uploadedUrl : "",
        lectureOrder: nextLectureOrder,
      };

      await axios.post(
        `${baseUrl}/api/instructor/supplementary/courses/${courseId}/lectures`,
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
      let newContentType = editLectureData.content_type;
      let newVideoUrl = editLectureData.video_url;
      let newDocumentUrl = editLectureData.document_url;

      if (pendingFileForEdit) {
        const fileTypeInfo = getFileTypeInfo(pendingFileForEdit);
        const uploadedUrl = await handleUploadFile(pendingFileForEdit);
        if (!uploadedUrl) {
          Swal.fire({
            icon: "error",
            title: "Upload Error",
            text: "File upload failed. Please try again.",
          });
          setIsLoading(false);
          return;
        }
        newContentType = fileTypeInfo.type;
        if (fileTypeInfo.urlField === "video_url") {
          newVideoUrl = uploadedUrl;
          newDocumentUrl = "";
        } else {
          newDocumentUrl = uploadedUrl;
          newVideoUrl = "";
        }
      }

      const updatedLectureData = {
        lecture_id: lectureToEdit.lecture_id,
        title: editLectureData.title,
        content_type: newContentType,
        video_url: newContentType === "video" ? newVideoUrl : "",
        document_url: newContentType !== "video" ? newDocumentUrl : "",
        lectureOrder: lectureToEdit.lectureOrder,
      };

      await axios.put(
        `${baseUrl}/api/instructor/supplementary/lectures/${lectureToEdit.lecture_id}`,
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
          `${baseUrl}/api/instructor/supplementary/lectures/${lecture_id}`,
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
        `${baseUrl}/api/instructor/supplementary/courses/${courseId}/lectures`,
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
  const getFileLabel = (type) => {
    switch (type) {
      case "video":
        return "Watch Video";
      case "pdf":
        return "PDF";
      case "txt":
        return "Text";
      // lập trình
      case "py":
        return "Python";
      case "js":
        return "JavaScript";
      case "ts":
        return "TypeScript";
      case "jsx":
        return "React (JSX)";
      case "tsx":
        return "React (TSX)";
      case "java":
        return "Java";
      case "c":
        return "C";
      case "cpp":
      case "cc":
        return "C++";
      case "cs":
        return "C#";
      case "php":
        return "PHP";
      case "rb":
        return "Ruby";
      case "go":
        return "Go";
      case "rs":
        return "Rust";
      case "sh":
        return "Shell Script";
      case "swift":
        return "Swift";
      case "kt":
      case "kts":
        return "Kotlin";
      case "r":
        return "R";
      case "scala":
        return "Scala";
      case "sql":
        return "SQL";
      case "html":
      case "htm":
        return "HTML";
      case "css":
        return "CSS";
      case "scss":
      case "sass":
        return "SASS/SCSS";
      case "xml":
        return "XML";
      case "json":
        return "JSON";
      case "yaml":
      case "yml":
        return "YAML";

      // Word
      case "doc":
        return "Word";
      case "docx":
        return "Word";
      case "docm":
        return "Word";
      case "dot ":
        return "Word";
      case "dotx":
        return "Word";
      case "dotm":
        return "Word";

      // Excel
      case "xltx ":
        return "Excel";
      case "xltm":
        return "Excel";
      case "xlt":
        return "Excel";
      case "xls":
        return "Excel";
      case "xlsx":
        return "Excel";
      case "xlsm":
        return "Excel";
      case "xlsb":
        return "Excel";
      default:
        return type.toUpperCase();
    }
  };
  const getFileColorClass = (type) => {
    switch (type) {
      case "video":
        return "bg-blue-600 hover:bg-blue-700";
      case "pdf":
        return "bg-red-600 hover:bg-red-700";

      // Word
      case "doc":
      case "docx":
      case "docm":
      case "dot":
      case "dotx":
      case "dotm":
        return "bg-blue-500 hover:bg-blue-600";

      // Excel
      case "xltx":
      case "xltm":
      case "xlt":
      case "xls":
      case "xlsx":
      case "xlsm":
      case "xlsb":
        return "bg-green-600 hover:bg-green-700";

      // Python
      case "py":
        return "bg-purple-600 hover:bg-purple-700";

      // JavaScript / TypeScript / React
      case "js":
      case "jsx":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "ts":
      case "tsx":
        return "bg-blue-400 hover:bg-blue-500";

      // Java
      case "java":
        return "bg-red-500 hover:bg-red-600";

      // C / C++
      case "c":
      case "cpp":
      case "cc":
        return "bg-gray-700 hover:bg-gray-800";

      // C#
      case "cs":
        return "bg-indigo-600 hover:bg-indigo-700";

      // PHP
      case "php":
        return "bg-indigo-500 hover:bg-indigo-600";

      // Ruby
      case "rb":
        return "bg-pink-500 hover:bg-pink-600";

      // Go
      case "go":
        return "bg-cyan-600 hover:bg-cyan-700";

      // Rust
      case "rs":
        return "bg-orange-700 hover:bg-orange-800";

      // Shell
      case "sh":
        return "bg-gray-600 hover:bg-gray-700";

      // Swift
      case "swift":
        return "bg-orange-500 hover:bg-orange-600";

      // Kotlin
      case "kt":
      case "kts":
        return "bg-purple-500 hover:bg-purple-600";

      // R
      case "r":
        return "bg-blue-800 hover:bg-blue-900";

      // Scala
      case "scala":
        return "bg-red-600 hover:bg-red-700";

      // SQL
      case "sql":
        return "bg-teal-600 hover:bg-teal-700";

      // Web
      case "html":
      case "htm":
        return "bg-orange-500 hover:bg-orange-600";
      case "css":
        return "bg-blue-300 hover:bg-blue-400";
      case "scss":
      case "sass":
        return "bg-pink-400 hover:bg-pink-500";

      // Data
      case "xml":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "json":
        return "bg-orange-400 hover:bg-orange-500";
      case "yaml":
      case "yml":
        return "bg-amber-600 hover:bg-amber-700";

      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getFileTextColorClass = (type) => {
    switch (type) {
      case "pdf":
        return "text-red-500";

      // Word
      case "doc":
      case "docx":
      case "docm":
      case "dot":
      case "dotx":
      case "dotm":
        return "text-blue-500";

      // Excel
      case "xltx":
      case "xltm":
      case "xlt":
      case "xls":
      case "xlsx":
      case "xlsm":
      case "xlsb":
        return "text-green-600";

      case "py":
        return "text-purple-600";
      case "js":
      case "jsx":
        return "text-yellow-500";
      case "ts":
      case "tsx":
        return "text-blue-400";
      case "java":
        return "text-red-500";
      case "c":
      case "cpp":
      case "cc":
        return "text-gray-700";
      case "cs":
        return "text-indigo-600";
      case "php":
        return "text-indigo-500";
      case "rb":
        return "text-pink-500";
      case "go":
        return "text-cyan-600";
      case "rs":
        return "text-orange-700";
      case "sh":
        return "text-gray-600";
      case "swift":
        return "text-orange-500";
      case "kt":
      case "kts":
        return "text-purple-500";
      case "r":
        return "text-blue-800";
      case "scala":
        return "text-red-600";
      case "sql":
        return "text-teal-600";
      case "html":
      case "htm":
        return "text-orange-500";
      case "css":
        return "text-blue-300";
      case "scss":
      case "sass":
        return "text-pink-400";
      case "xml":
        return "text-yellow-600";
      case "json":
        return "text-orange-400";
      case "yaml":
      case "yml":
        return "text-amber-600";

      default:
        return "text-gray-500";
    }
  };
  async function downloadFile(url, filename) {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
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
                      <span
                        className={`text-5xl font-bold ${getFileTextColorClass(
                          lecture.content_type
                        )}`}
                      >
                        {lecture.content_type.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-auto text-center">
                  {lecture.content_type === "video" ? (
                    <a
                      href={lecture.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block ${getFileColorClass(
                        "video"
                      )} text-white font-medium py-2 px-4 rounded`}
                    >
                      {getFileLabel("video")}
                    </a>
                  ) : lecture.content_type === "pdf" ? (
                    <a
                      href={lecture.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block ${getFileColorClass(
                        "pdf"
                      )} text-white font-medium py-2 px-4 rounded`}
                    >
                      View {getFileLabel("pdf")}
                    </a>
                  ) : (
                    <button
                      onClick={() =>
                        downloadFile(
                          lecture.document_url,
                          `${lecture.title}.${lecture.content_type}`
                        )
                      }
                      className={`inline-block ${getFileColorClass(
                        lecture.content_type
                      )} text-white font-medium py-2 px-4 rounded`}
                    >
                      Download {getFileLabel(lecture.content_type)}
                    </button>
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
              : "Chọn tài liệu để tải lên"}
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
                  Tải file
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
