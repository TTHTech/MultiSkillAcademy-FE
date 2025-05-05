import React, { useEffect, useState } from "react";
import CreateStudyReminder from "./AddStudyReminder";
import UpdateStudyReminder from "./UpdateStudyReminder";
import { useParams } from "react-router-dom";
import axios from "axios";
import { decodeId } from '../../../utils/hash';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const StudyReminderList = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [remindersPerPage] = useState(4);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const { courseHash } = useParams();
  const id = decodeId(courseHash);
  const userId = localStorage.getItem("userId");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(
        `${baseUrl}/api/student/reminders/user/${userId}/course/${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setReminders(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [userId, id, refresh]);
  const triggerRefresh = () => setRefresh((prev) => !prev);
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
        await axios.delete(
          `${baseUrl}/api/student/reminders/${reminderId}`
        );
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

  if (loading) return <div className="text-center text-lg">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const totalPages = Math.ceil(reminders.length / remindersPerPage);
  const changeActive = async (reminderId) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/student/reminders/${reminderId}/status`
      );

      console.log(response.data);
      triggerRefresh();
    } catch (error) {
      console.error(
        "Error changing reminder status:",
        error.response?.data || error.message
      );
      alert("Failed to change reminder status. Please try again.");
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Danh sách nhắc nhở học tập
      </h2>
      <div className="flex justify-center mt-6 mb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Tạo nhắc nhở mới
        </button>
      </div>

      {showCreateModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white p-12 rounded-lg shadow-xl w-128 max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-semibold text-center mb-6">
              Tạo nhắc nhở học tập
            </h3>
            <CreateStudyReminder
              closeModal={() => setShowCreateModal(false)}
              triggerRefresh={triggerRefresh}
            />
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}

      {showUpdateModal && selectedReminder && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50"
          onClick={() => setShowUpdateModal(false)}
        >
          <div
            className="bg-white p-12 rounded-lg shadow-xl w-128 max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-semibold text-center mb-6">
              Cập nhật nhắc nhở
            </h3>
            <UpdateStudyReminder
              Data={selectedReminder}
              closeModal={() => setShowUpdateModal(false)}
              onUpdate={handleUpdate}
              triggerRefresh={triggerRefresh}
            />
          </div>
        </div>
      )}

      <div className="space-y-8">
        {currentReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg bg-gray-100 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-gray-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="3" fill="white" />
            <line x1="50" y1="50" x2="50" y2="25" stroke="red" strokeWidth="3" />
            <line x1="50" y1="50" x2="70" y2="50" stroke="blue" strokeWidth="2" />
            <circle cx="50" cy="50" r="3" fill="black" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">
            Bạn không có nhắc nhở nào.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Bạn có thể đặt lịch để nhận thông báo nhắc nhở.
          </p>
        </div>
        ) : (
          currentReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-green-500 flex flex-col space-y-4"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-blue-600">
                  {reminder.content}
                </h3>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-3 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">Tần xuất:</h3>
                    <span className="text-lg text-gray-700">
                      {renderFrequency(reminder)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">Thời gian:</h3>
                    <span className="text-lg text-gray-700">
                      {`${String(reminder.time[0]).padStart(2, "0")}:${String(
                        reminder.time[1]
                      ).padStart(2, "0")}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">
                      Email nhận thông báo:
                    </h3>
                    <span className="text-lg text-gray-700">
                      {reminder.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">
                      Ngày nhận thông báo gần nhất:
                    </h3>
                    <span className="text-lg text-gray-700">
                      {reminder.lastSentAt &&
                      reminder.lastSentAt.length === 7 ? (
                        (() => {
                          const dateParts = reminder.lastSentAt;
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
                        })()
                      ) : (
                        <span>Không có dữ liệu</span>
                      )}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex justify-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out ${
                    reminder.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                  onClick={() => changeActive(reminder.id)}
                >
                  {reminder.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setSelectedReminder(reminder);
                    setShowUpdateModal(true);
                  }}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 active:scale-95"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 active:scale-95"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Trước
        </button>
        <span className="text-lg font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};
export default StudyReminderList;
