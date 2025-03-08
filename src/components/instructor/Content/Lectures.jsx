import { useState } from "react";
import Swal from "sweetalert2";

const Lectures = ({ lectures, sectionId, triggerRefresh }) => {
  const initialLectures = lectures
    .slice()
    .sort((a, b) => a.lectureOrder - b.lectureOrder);
  const [lectureList, setLectureList] = useState(initialLectures);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [pendingFileForEdit, setPendingFileForEdit] = useState({});
  const [pendingFileForNewLecture, setPendingFileForNewLecture] =
    useState(null);
  const [editStates, setEditStates] = useState(
    initialLectures.reduce((acc, lecture) => {
      acc[lecture.lecture_id] = false;
      return acc;
    }, {})
  );
  const [isLoading, setIsLoading] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newLecture, setNewLecture] = useState({
    title: "",
    content_type: "Video",
    video_url: "",
    document_url: "",
    duration: "",
  });
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
  const toggleEdit = (id) => {
    setEditStates((prev) => {
      if (!prev[id]) {
        const newState = {};
        Object.keys(prev).forEach((key) => {
          newState[key] = false;
        });
        newState[id] = true;
        return newState;
      } else {
        return { ...prev, [id]: false };
      }
    });
  };

  const handleTitleChange = (index, value) => {
    const updated = [...lectureList];
    updated[index].title = value;
    setLectureList(updated);
  };
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (index) => {
    if (draggedIndex === null) return;
    const updated = [...lectureList];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    const reordered = updated.map((lecture, idx) => ({
      ...lecture,
      lectureOrder: idx + 1,
    }));
    setLectureList(reordered);
    setDraggedIndex(null);
    for (const lecture of reordered) {
      const updatedLectureData = {
        lectureId: lecture.lecture_id,
        sectionId: sectionId,
        title: lecture.title,
        contentType: lecture.content_type,
        videoUrl: lecture.video_url,
        documentUrl: lecture.document_url,
        duration: lecture.duration,
        lectureOrder: lecture.lectureOrder,
      };
      try {
        await fetch(
          `http://localhost:8080/api/instructor/update-lecture/${lecture.lecture_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedLectureData),
          }
        );
      } catch (error) {
        console.error("Error updating lecture order:", error);
      }
    }
  };

  const handleUpdateLecture = async (lecture) => {
    if (!lecture.title.trim() || !lecture.duration.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
      });
      return;
    }
    let file = pendingFileForEdit[lecture.lecture_id];
    let uploadedUrl = "";
    let newContentType = lecture.content_type;
    if (file) {
      if (file.type.startsWith("video/")) {
        setIsLoading(true);
        uploadedUrl = await handleUploadVideo(file);
        newContentType = "video";
      } else if (file.type === "application/pdf") {
        setIsLoading(true);
        uploadedUrl = await handleUploadPdf(file);
        newContentType = "pdf";
      } else {
        setIsLoading(false);
        alert(
          "Loại file không được hỗ trợ. Vui lòng upload file video hoặc PDF."
        );
        return;
      }
    }

    const updatedLectureData = {
      lectureId: lecture.lecture_id,
      sectionId: sectionId,
      title: lecture.title,
      contentType: newContentType,
      videoUrl:
        newContentType === "video" ? uploadedUrl || lecture.video_url : "",
      documentUrl:
        newContentType === "pdf" ? uploadedUrl || lecture.document_url : "",
      duration: lecture.duration,
      lectureOrder: lecture.lectureOrder,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/instructor/update-lecture/${lecture.lecture_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedLectureData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update lecture");
      }
      const result = await response.text();
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Lecture Added",
        text: result,
      });
      setLectureList((prevList) =>
        prevList.map((item) =>
          item.lecture_id === lecture.lecture_id
            ? {
                ...item,
                content_type: newContentType,
                video_url:
                  newContentType === "video"
                    ? uploadedUrl || item.video_url
                    : "",
                document_url:
                  newContentType === "pdf"
                    ? uploadedUrl || item.document_url
                    : "",
              }
            : item
        )
      );
      toggleEdit(lecture.lecture_id);
      setPendingFileForEdit((prev) => {
        const newPending = { ...prev };
        delete newPending[lecture.lecture_id];
        return newPending;
      });
      triggerRefresh();
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating lecture:", error);
      alert("Error updating lecture");
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn xóa bài học này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/instructor/delete-lecture/${lectureId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete lecture");
      }
      const result = await response.text();
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Lecture Added",
        text: result,
      });
      triggerRefresh();
      setLectureList((prev) =>
        prev.filter((lecture) => lecture.lecture_id !== lectureId)
      );
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting lecture:", error);
      alert("Error deleting lecture");
    }
  };

  const handleAddLecture = async () => {
    if (
      !newLecture.title ||
      (!newLecture.video_url &&
        !newLecture.document_url &&
        !pendingFileForNewLecture) ||
      !newLecture.duration
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
      });
      return;
    }
    let uploadedUrl = "";
    let newContentType = newLecture.content_type;
    if (pendingFileForNewLecture) {
      if (pendingFileForNewLecture.type.startsWith("video/")) {
        setIsLoading(true);
        uploadedUrl = await handleUploadVideo(pendingFileForNewLecture);
        newContentType = "video";
      } else if (pendingFileForNewLecture.type === "application/pdf") {
        setIsLoading(true);
        uploadedUrl = await handleUploadPdf(pendingFileForNewLecture);
        newContentType = "pdf";
      } else {
        setIsLoading(false);
        alert(
          "Loại file không được hỗ trợ. Vui lòng upload file video hoặc PDF."
        );
        return;
      }
    }

    const lectureId = sectionId + "_" + Date.now();
    const lectureOrder = lectureList.length + 1;
    const newLectureData = {
      lectureId: lectureId,
      sectionId: sectionId,
      title: newLecture.title,
      contentType: newContentType,
      videoUrl:
        newContentType === "video" ? uploadedUrl || newLecture.video_url : "",
      documentUrl:
        newContentType === "pdf" ? uploadedUrl || newLecture.document_url : "",
      duration: newLecture.duration,
      lectureOrder: lectureOrder,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/instructor/add-lecture",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newLectureData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add lecture");
      }
      const result = await response.text();
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Lecture Added",
        text: result,
      });
      triggerRefresh();
      setLectureList([
        ...lectureList,
        {
          lecture_id: lectureId,
          title: newLecture.title,
          content_type: newContentType,
          video_url:
            newContentType === "video"
              ? uploadedUrl || newLecture.video_url
              : "",
          document_url:
            newContentType === "pdf"
              ? uploadedUrl || newLecture.document_url
              : "",
          duration: newLecture.duration,
          lectureOrder: lectureOrder,
        },
      ]);
      setNewLecture({
        title: "",
        content_type: "video",
        video_url: "",
        document_url: "",
        duration: "",
      });
      setPendingFileForNewLecture(null);
      setIsAdding(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding lecture:", error);
      alert("Error adding lecture");
    }
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
    <div>
      <div className="mt-4 space-y-4">
        {lectureList && lectureList.length > 0 ? (
          lectureList.map((lecture, index) => (
            <div
              key={lecture.lecture_id}
              className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-md hover:shadow-lg transition"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <div className="flex-1">
                {editStates[lecture.lecture_id] ? (
                  <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-2/3">
                        <label className="block text-gray-700 font-bold">
                          Tên bài học
                        </label>
                        <p className="text-gray-500 text-sm italic">
                          Nhập tên bài học của bạn sao cho ngắn gọn và dễ hiểu.
                        </p>
                        <input
                          type="text"
                          placeholder="Tên bài học"
                          value={lecture.title}
                          onChange={(e) =>
                            handleTitleChange(index, e.target.value)
                          }
                          className="p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold">
                          Duration
                        </label>
                        <p className="text-gray-500 text-sm italic">
                          Nhập thời gian (mins, hours).
                        </p>
                        <input
                          type="text"
                          placeholder="Duration"
                          value={lecture.duration}
                          onChange={(e) =>
                            setLectureList((prev) => {
                              const updated = [...prev];
                              updated[index].duration = e.target.value;
                              return updated;
                            })
                          }
                          className="p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="block text-gray-700 font-bold">
                          Tải file
                        </label>
                        <p className="text-gray-500 text-sm italic">
                          Hãy tải lên nội dung thay thế cho bài học hiện tại
                          này.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <label className="cursor-pointer flex-1 p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center border border-dashed border-gray-300 rounded">
                          {pendingFileForEdit[lecture.lecture_id]
                            ? pendingFileForEdit[lecture.lecture_id].name
                            : "Chọn Video hoặc PDF"}
                          <input
                            type="file"
                            accept="video/*,application/pdf"
                            onChange={(e) =>
                              setPendingFileForEdit((prev) => ({
                                ...prev,
                                [lecture.lecture_id]: e.target.files[0],
                              }))
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    {/* Hiển thị file hiện tại nếu có */}
                    {lecture.content_type === "video" && lecture.video_url && (
                      <p className="text-sm text-gray-500">
                        Video hiện tại:
                        <a
                          href={lecture.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {lecture.video_url}
                        </a>
                      </p>
                    )}
                    {lecture.content_type === "pdf" && lecture.document_url && (
                      <p className="text-sm text-gray-500">
                        PDF hiện tại:
                        <a
                          href={lecture.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {lecture.document_url}
                        </a>
                      </p>
                    )}
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => handleUpdateLecture(lecture)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => toggleEdit(lecture.lecture_id)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-medium">
                      Bài học {lecture.lectureOrder}: {lecture.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Duration: {lecture.duration}
                    </p>
                  </>
                )}
              </div>
              {!editStates[lecture.lecture_id] && (
                <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                  {lecture.content_type === "video" && lecture.video_url && (
                    <a
                      href={lecture.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition font-semibold"
                    >
                      Watch Video
                    </a>
                  )}
                  {lecture.content_type === "pdf" && lecture.document_url && (
                    <a
                      href={lecture.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 transition font-semibold"
                    >
                      Download PDF
                    </a>
                  )}
                  <button
                    onClick={() => toggleEdit(lecture.lecture_id)}
                    className="border border-yellow-500 text-yellow-500 rounded px-3 py-1 hover:bg-yellow-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLecture(lecture.lecture_id)}
                    className="border border-red-500 text-red-500 rounded px-3 py-1 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                  <button
                    className="border border-gray-400 text-gray-600 rounded px-3 py-1 hover:bg-gray-200 transition cursor-move"
                    title="Kéo để thay đổi vị trí"
                  >
                    ☰
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No lectures available.</p>
        )}
      </div>
      <h1 className="text-lg font-semibold mt-4">Thêm bài học mới</h1>
      <p className="text-gray-500 text-sm italic mb-2">
        Hãy đảm bảo bài học có nội dung phù hợp với chương hiện tại.
      </p>
      <div className="flex flex-col gap-4 p-4 border rounded-md">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-2/3">
            <label className="block text-gray-700 font-bold">Tên bài học</label>
            <p className="text-gray-500 text-sm italic">
              Nhập tên bài học của bạn sao cho ngắn gọn và dễ hiểu.
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Duration</label>
            <p className="text-gray-500 text-sm italic">
              Nhập thời gian cần để học (mins, hours).
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
          <input
            type="text"
            placeholder="Duration (mins, hours)"
            value={newLecture.duration}
            onChange={(e) =>
              setNewLecture({ ...newLecture, duration: e.target.value })
            }
            className="p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div>
            <label className="block text-gray-700 font-bold">Tải file</label>
            <p className="text-gray-500 text-sm italic">
              Hãy tải lên nội dung của bài học này.
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
              onChange={(e) => setPendingFileForNewLecture(e.target.files[0])}
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
    </div>
  );
};

export default Lectures;
