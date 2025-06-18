import React, { useState } from "react";
import Swal from "sweetalert2";
import { 
  Play, FileText, Eye, CheckCircle, XCircle, 
  Lock, Unlock, X, Film, Book, Layers, Bookmark 
} from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const TableLecture = ({ lectures, triggerRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [currentLecture, setCurrentLecture] = useState(null);

  // Handle status toggle
  const handleToggleStatus = async (lecture) => {
    const token = localStorage.getItem("token");
    
    const result = await Swal.fire({
      title: `${lecture.status ? "Khóa" : "Mở khóa"} bài giảng`,
      html: `Bạn có chắc chắn muốn <strong>${lecture.status ? "khóa" : "mở khóa"}</strong> bài giảng:<br><br>
            <span class="text-lg font-semibold">"${lecture.title}"</span><br>
            <span class="text-sm text-gray-400">Thuộc: ${lecture.sectionName} - ${lecture.courseName}</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Có, ${lecture.status ? "khóa" : "mở khóa"} ngay!`,
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: lecture.status ? "#EF4444" : "#10B981",
      cancelButtonColor: "#6B7280",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/api/admin/lectures/${lecture.lectureId}/toggle-status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error("Lỗi khi thay đổi trạng thái bài giảng");
        }
        
        Swal.fire({
          title: "Thành công!",
          text: `Bài giảng đã được ${lecture.status ? "khóa" : "mở khóa"}.`,
          icon: "success",
          confirmButtonColor: "#10B981",
        });
        
        triggerRefresh();
      } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái:", error);
        
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi thay đổi trạng thái bài giảng.",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle resource viewing
  const handleViewResource = (lecture) => {
    if (lecture.contentType === "video" && lecture.videoUrl) {
      // Show video in modal instead of new tab
      setCurrentVideo(lecture.videoUrl);
      setCurrentLecture(lecture);
      setVideoModalOpen(true);
    } else if (lecture.contentType === "pdf" && lecture.documentUrl) {
      // PDFs still open in new tab
      window.open(lecture.documentUrl, "_blank");
    } else {
      Swal.fire({
        title: "Không có tài liệu",
        text: "Không tìm thấy đường dẫn tài liệu tương ứng.",
        icon: "info",
        confirmButtonColor: "#3B82F6",
      });
    }
  };

  // Close video modal
  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setCurrentVideo("");
    setCurrentLecture(null);
  };

  // Get content type icon
  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <Film size={16} className="text-blue-400" />;
      case "pdf":
        return <FileText size={16} className="text-red-400" />;
      default:
        return <Book size={16} className="text-gray-400" />;
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1 text-gray-300">
                  <Bookmark size={14} />
                  <span>ID</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1 text-gray-300">
                  <Book size={14} />
                  <span>Tiêu đề</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1 text-gray-300">
                  <Layers size={14} />
                  <span>Chương học</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                <div className="flex items-center space-x-1 text-gray-300">
                  <Book size={14} />
                  <span>Khóa học</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1 text-gray-300">
                  <Eye size={14} />
                  <span>Tài liệu</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1 text-gray-300">
                  <CheckCircle size={14} />
                  <span>Trạng thái</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {lectures && lectures.length > 0 ? (
              lectures.map((lecture, index) => (
                <tr 
                  key={lecture.lectureId}
                  className={`hover:bg-gray-800 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
                    #{lecture.lectureId}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    <div className="flex items-center">
                      {getContentTypeIcon(lecture.contentType)}
                      <span className="ml-2 font-medium">
                        {lecture.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {lecture.sectionName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 hidden md:table-cell">
                    {lecture.courseName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {lecture.contentType === "video" && lecture.videoUrl ? (
                      <button
                        onClick={() => handleViewResource(lecture)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                      >
                        <Play size={16} className="mr-1.5" />
                        Xem Video
                      </button>
                    ) : lecture.contentType === "pdf" && lecture.documentUrl ? (
                      <button
                        onClick={() => handleViewResource(lecture)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                      >
                        <FileText size={16} className="mr-1.5" />
                        Xem PDF
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm italic">
                        Không có dữ liệu
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {lecture.status ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle size={12} className="mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      onClick={() => !loading && handleToggleStatus(lecture)}
                      disabled={loading}
                      className={`
                        inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                        ${lecture.status 
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white' 
                          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white'
                        }
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {lecture.status ? (
                        <>
                          <Lock size={16} className="mr-1.5" />
                          Khóa
                        </>
                      ) : (
                        <>
                          <Unlock size={16} className="mr-1.5" />
                          Mở khóa
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <Book size={40} className="mb-3 text-gray-500" />
                    <p className="text-lg font-medium text-gray-300">Không có bài giảng nào</p>
                    <p className="mt-1 text-gray-400">Chưa có dữ liệu bài giảng trong hệ thống</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 animate-fadeIn">
          <div className="relative bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-scaleIn">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-xl font-medium text-white flex items-center">
                <Film className="text-blue-400 mr-2" size={20} />
                {currentLecture?.title || "Xem Video"}
              </h3>
              <button
                onClick={closeVideoModal}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="w-full flex-1 overflow-hidden">
              <div className="aspect-video w-full bg-black">
                <iframe 
                  src={currentVideo} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  title="Video Player"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
            
            {currentLecture && (
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold text-gray-300">Section:</span> {currentLecture.sectionName}
                </div>
                <div className="mb-4 text-sm text-gray-400">
                  <span className="font-semibold text-gray-300">Khóa học:</span> {currentLecture.courseName}
                </div>
                <button
                  onClick={closeVideoModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default TableLecture;