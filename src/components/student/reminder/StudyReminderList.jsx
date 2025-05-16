import { useEffect, useState } from "react";
import CreateStudyReminder from "./AddStudyReminder";
import UpdateStudyReminder from "./UpdateStudyReminder";
import axios from "axios";
import { Bell, AlertTriangle, Clock, Mail, Calendar, Plus, Edit, Trash2, X, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const StudyReminderList = ({ courseId, nameCourse, triggerMainRefresh }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [remindersPerPage] = useState(4);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const userId = localStorage.getItem("userId");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(
        `${baseUrl}/api/student/reminders/user/${userId}/course/${courseId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Có lỗi xảy ra khi tải dữ liệu");
          }
          return response.json();
        })
        .then((data) => {
          setReminders(data);
          setLoading(false);
          setError(null);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [userId, courseId, refresh]);
  
  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
    if (triggerMainRefresh) triggerMainRefresh();
  };
  
  const indexOfLastReminder = currentPage * remindersPerPage;
  const indexOfFirstReminder = indexOfLastReminder - remindersPerPage;
  const currentReminders = reminders.slice(
    indexOfFirstReminder,
    indexOfLastReminder
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (reminderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhắc nhở này?")) {
      try {
        await axios.delete(`${baseUrl}/api/student/reminders/${reminderId}`);
        setReminders(
          reminders.filter((reminder) => reminder.id !== reminderId)
        );
        alert("Nhắc nhở đã được xóa!");
        triggerRefresh();
      } catch (error) {
        console.error("Lỗi khi xóa nhắc nhở:", error);
        alert("Có lỗi xảy ra khi xóa nhắc nhở!");
      }
    }
  };

  const handleUpdate = (updatedReminder) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === updatedReminder.id ? updatedReminder : reminder
      )
    );
    triggerRefresh();
  };

  const renderFrequency = (reminder) => {
    if (reminder.frequency === "Hàng tuần") {
      const daysMapping = {
        Su: "Chủ nhật",
        Mo: "Thứ 2",
        Tu: "Thứ 3",
        We: "Thứ 4",
        Th: "Thứ 5",
        Fr: "Thứ 6",
        Sa: "Thứ 7",
      };
      const selectedDays = reminder.selectedDays
        .map((day) => daysMapping[day] || day)
        .join(", ");
      return `Hàng tuần (${selectedDays})`;
    }
    return reminder.frequency;
  };

  const changeActive = async (reminderId) => {
    try {
      await axios.patch(
        `${baseUrl}/api/student/reminders/${reminderId}/status`
      );
      triggerRefresh();
    } catch (error) {
      console.error(
        "Lỗi khi thay đổi trạng thái:",
        error.response?.data || error.message
      );
      alert("Không thể thay đổi trạng thái. Vui lòng thử lại.");
    }
  };

  const formatLastSentDate = (lastSentAt) => {
    if (!lastSentAt || lastSentAt.length !== 7) {
      return "Chưa có dữ liệu";
    }

    try {
      const dateParts = lastSentAt;
      const date = new Date(
        dateParts[0], // Năm
        dateParts[1] - 1, // Tháng (bắt đầu từ 0)
        dateParts[2], // Ngày
        dateParts[3], // Giờ
        dateParts[4], // Phút
        dateParts[5] // Giây
      );
      
      return date.toLocaleString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Định dạng không hợp lệ";
    }
  };

  const formatTime = (timeArray) => {
    if (!timeArray || timeArray.length < 2) return "--:--";
    return `${String(timeArray[0]).padStart(2, "0")}:${String(timeArray[1]).padStart(2, "0")}`;
  };

  const totalPages = Math.ceil(reminders.length / remindersPerPage);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải nhắc nhở...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Danh sách nhắc nhở học tập
        </h2>
        <p className="text-indigo-600 font-medium text-lg">{nameCourse}</p>
      </div>
      
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 flex items-center font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tạo nhắc nhở mới
        </button>
      </div>

      {/* Empty State */}
      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="bg-indigo-50 p-4 rounded-full mb-4">
            <Bell className="w-10 h-10 text-indigo-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Chưa có nhắc nhở nào
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Bạn chưa có nhắc nhở nào cho khóa học này. Hãy tạo nhắc nhở để giúp bạn duy trì việc học đều đặn.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-300 border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className={`p-4 ${reminder.isActive ? 'bg-green-50 border-b border-green-100' : 'bg-red-50 border-b border-red-100'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className={`h-5 w-5 ${reminder.isActive ? 'text-green-600' : 'text-red-600'} mr-2`} />
                    <h3 className="font-semibold text-gray-800">
                      {reminder.content}
                    </h3>
                  </div>
                  <button
                    onClick={() => changeActive(reminder.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                      reminder.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {reminder.isActive ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Đang hoạt động
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Không hoạt động
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-indigo-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tần suất</p>
                      <p className="font-medium text-gray-800">{renderFrequency(reminder)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-indigo-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Thời gian</p>
                      <p className="font-medium text-gray-800">{formatTime(reminder.time)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-indigo-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email nhận thông báo</p>
                      <p className="font-medium text-gray-800">{reminder.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-indigo-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Lần gửi gần nhất</p>
                      <p className="font-medium text-gray-800">{formatLastSentDate(reminder.lastSentAt)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex mt-6 pt-4 border-t border-gray-100 gap-3">
                  <button
                    onClick={() => {
                      setSelectedReminder(reminder);
                      setShowUpdateModal(true);
                    }}
                    className="px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Cập nhật
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {reminders.length > remindersPerPage && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trước
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
            let pageToShow;
            
            if (totalPages <= 5) {
              pageToShow = idx + 1;
            } else if (currentPage <= 3) {
              pageToShow = idx + 1;
            } else if (currentPage >= totalPages - 2) {
              pageToShow = totalPages - 4 + idx;
            } else {
              pageToShow = currentPage - 2 + idx;
            }
            
            if (pageToShow > 0 && pageToShow <= totalPages) {
              return (
                <button
                  key={pageToShow}
                  onClick={() => paginate(pageToShow)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                    currentPage === pageToShow
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {pageToShow}
                </button>
              );
            }
            return null;
          })}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
          >
            Sau
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-auto w-full max-w-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-10">
              <h3 className="text-xl font-semibold text-gray-800">
                Tạo nhắc nhở học tập mới
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Đóng"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <CreateStudyReminder
                closeModal={() => setShowCreateModal(false)}
                triggerRefresh={triggerRefresh}
                courseId={courseId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedReminder && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={() => setShowUpdateModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-auto w-full max-w-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-10">
              <h3 className="text-xl font-semibold text-gray-800">
                Cập nhật nhắc nhở học tập
              </h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Đóng"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <UpdateStudyReminder
                Data={selectedReminder}
                closeModal={() => setShowUpdateModal(false)}
                onUpdate={handleUpdate}
                triggerRefresh={triggerRefresh}
                courseId={courseId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyReminderList;