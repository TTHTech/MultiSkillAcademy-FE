import { useEffect, useState } from "react";
import StudyReminderList from "./StudyReminderList";

const Reminder = () => {
  const userId = Number(localStorage.getItem("userId"));
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const itemsPerPage = 6;
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/student/reminders/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setReminders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, [userId, refresh]);

  const filteredReminders = reminders
    .filter((reminder) =>
      reminder.nameCourse.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "active") return b.active - a.active;
      if (sortBy === "inactive") return b.inactive - a.inactive;
      return 0;
    });

  const totalPages = Math.ceil(filteredReminders.length / itemsPerPage);
  const displayedReminders = filteredReminders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleClose = (e) => {
    if (e.target.id === "overlay") {
      setSelectedCourse(null);
    }
    triggerRefresh();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Reminder Notifications
      </h1>
      <input
        type="text"
        placeholder="Search by course name..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mb-4">
        <button
          onClick={() => setSortBy("active")}
          className="mr-2 p-2 bg-blue-500 text-white rounded"
        >
          Sort by Active
        </button>
        <button
          onClick={() => setSortBy("inactive")}
          className="p-2 bg-red-500 text-white rounded"
        >
          Sort by Inactive
        </button>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : displayedReminders.length === 0 ? (
        <p className="text-gray-600">No reminders found.</p>
      ) : (
        <div className="space-y-4">
          {displayedReminders.map((reminder) => (
            <div
              key={reminder.courseId}
              className="p-4 border shadow-md flex justify-between items-center bg-gray-50 cursor-pointer"
              onClick={() => handleSelectCourse(reminder)}
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {reminder.nameCourse}
                </h2>
              </div>
              <div className="flex space-x-4">
                <div className="text-green-600 font-semibold">
                  Active: {reminder.active}
                </div>
                <div className="text-red-600 font-semibold">
                  Inactive: {reminder.inactive}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 active:bg-gray-700"
        >
          Previous
        </button>

        <span className="text-lg font-medium text-gray-700">
          Page <span className="font-bold">{currentPage}</span> of{" "}
          <span className="font-bold">{totalPages}</span>
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 active:bg-gray-700"
        >
          Next
        </button>
      </div>

      {selectedCourse && (
        <div
          id="overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white p-6 max-h-[calc(100vh-230px)] overflow-auto w-full max-w-4xl rounded-lg shadow-lg absolute left-1/2 transform -translate-x-1/2"
            style={{ top: "120px", bottom: "2px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <StudyReminderList
              courseId={selectedCourse.courseId}
              nameCourse={selectedCourse.nameCourse}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="mt-4 p-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminder;
