import { useEffect, useState } from "react";
import axios from "axios";

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
          `http://localhost:8080/api/student/supplementary/courses/${courseId}/lectures`,
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
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                >
                  Xem Video
                </a>
              ) : (
                <a
                  href={lecture.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                >
                  Xem Tài Liệu
                </a>
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