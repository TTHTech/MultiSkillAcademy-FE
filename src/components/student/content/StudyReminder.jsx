import React, { useEffect, useState } from "react";
import CreateStudyReminder from "./AddStudyReminder";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudyReminderList = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [remindersPerPage] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [editingReminder, setEditingReminder] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(
        `http://localhost:8080/api/student/reminders/user/${userId}/course/${id}`
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
  }, [userId, id]);

  const indexOfLastReminder = currentPage * remindersPerPage;
  const indexOfFirstReminder = indexOfLastReminder - remindersPerPage;
  const currentReminders = reminders.slice(
    indexOfFirstReminder,
    indexOfLastReminder
  );

  if (loading) return <div className="text-center text-lg">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(reminders.length / remindersPerPage);

  const handleDelete = async (reminderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhắc nhở này?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/student/reminders/${reminderId}`
        );
        setReminders(
          reminders.filter((reminder) => reminder.id !== reminderId)
        );
        alert("Nhắc nhở đã được xóa!");
      } catch (error) {
        console.error("Lỗi khi xóa nhắc nhở:", error);
        alert("Có lỗi xảy ra khi xóa nhắc nhở!");
      }
    }
  };

  const handleUpdate = (reminder) => {
    setEditingReminder(reminder);
  };

  const handleSaveUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/student/reminders/${editingReminder.id}`,
        editingReminder
      );
      setReminders(
        reminders.map((reminder) =>
          reminder.id === editingReminder.id ? editingReminder : reminder
        )
      );
      setEditingReminder(null);
      alert("Nhắc nhở đã được cập nhật!");
    } catch (error) {
      console.error("Lỗi khi cập nhật nhắc nhở:", error);
      alert("Có lỗi xảy ra khi cập nhật nhắc nhở!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Danh sách nhắc nhở học tập
      </h2>
      <div className="flex justify-center mt-6 mb-8">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Tạo nhắc nhở mới
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-12 rounded-lg shadow-xl w-128 max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-semibold text-center mb-6">
              Tạo nhắc nhở học tập
            </h3>
            <CreateStudyReminder closeModal={() => setShowModal(false)} />
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {currentReminders.length === 0 ? (
          <p className="text-center text-gray-500 font-semibold">
            Không có nhắc nhở nào.
          </p>
        ) : (
          currentReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-6">
                {editingReminder && editingReminder.id === reminder.id ? (
                  <>
                    <div className="flex space-x-6 w-full">
                      <input
                        type="text"
                        value={editingReminder.content}
                        onChange={(e) =>
                          setEditingReminder({
                            ...editingReminder,
                            content: e.target.value,
                          })
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập nội dung"
                      />
                      <input
                        type="text"
                        value={editingReminder.frequency}
                        onChange={(e) =>
                          setEditingReminder({
                            ...editingReminder,
                            frequency: e.target.value,
                          })
                        }
                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tần suất"
                      />
                      <input
                        type="time"
                        value={`${String(editingReminder.time[0]).padStart(
                          2,
                          "0"
                        )}:${String(editingReminder.time[1]).padStart(2, "0")}`}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          setEditingReminder({
                            ...editingReminder,
                            time: [parseInt(hours), parseInt(minutes)],
                          });
                        }}
                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center mt-4 space-x-3">
                      <input
                        type="checkbox"
                        checked={editingReminder.isActive}
                        onChange={(e) =>
                          setEditingReminder({
                            ...editingReminder,
                            isActive: e.target.checked,
                          })
                        }
                        className="h-5 w-5 text-blue-500"
                      />
                      <label className="text-sm text-gray-700">
                        Trạng thái hoạt động
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold text-blue-600">
                      {reminder.content}
                    </h3>
                    <div className="space-x-6 text-sm text-gray-600">
                      <span>{reminder.frequency}</span>
                      <span>{`${String(reminder.time[0]).padStart(
                        2,
                        "0"
                      )}:${String(reminder.time[1]).padStart(2, "0")}`}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          reminder.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {reminder.isActive
                          ? "Đang hoạt động"
                          : "Ngừng hoạt động"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-sm text-gray-500 mb-6">
                <p className="mb-1">Khóa học: {reminder.courseId}</p>
                <p className="mb-1">
                  Thời gian thông báo:{" "}
                  {`${String(reminder.time[0]).padStart(2, "0")}:${String(
                    reminder.time[1]
                  ).padStart(2, "0")}`}
                </p>
                <p>Lần cuối gửi: {reminder.lastSentAt || "Chưa gửi"}</p>
              </div>

              <div className="flex justify-end space-x-6">
                {editingReminder && editingReminder.id === reminder.id ? (
                  <button
                    onClick={handleSaveUpdate}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                  >
                    Lưu
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdate(reminder)}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300"
                  >
                    Cập nhật
                  </button>
                )}
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
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
