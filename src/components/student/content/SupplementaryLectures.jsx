import { useEffect, useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ITEMS_PER_PAGE = 9;

const StudentLectures = ({ courseId }) => {
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/student/supplementary/courses/${courseId}/lectures`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLectures(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tài liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectures();
  }, [courseId, token]);

  const totalPages = Math.ceil(lectures.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentLectures = lectures.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 font-medium text-gray-600">
        Đang tải dữ liệu...
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {currentLectures.map((lecture) => (
          <div
            key={lecture.lecture_id}
            className="border rounded-md shadow-md flex flex-col p-4 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-left mb-4 truncate">
              {lecture.title}
            </h2>
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
                    {getFileLabel(lecture.content_type)}
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
                  )} text-white font-medium py-2 px-4 rounded transition-colors duration-300`}
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
                  )} text-white font-medium py-2 px-4 rounded transition-colors duration-300`}
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
                  )} text-white font-medium py-2 px-4 rounded transition-colors duration-300`}
                >
                  Download {getFileLabel(lecture.content_type)}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() =>
              handlePageChange(currentPage - 1 < 1 ? 1 : currentPage - 1)
            }
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors duration-300"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-1 rounded transition-colors duration-300 ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() =>
              handlePageChange(
                currentPage + 1 > totalPages ? totalPages : currentPage + 1
              )
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors duration-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentLectures;
