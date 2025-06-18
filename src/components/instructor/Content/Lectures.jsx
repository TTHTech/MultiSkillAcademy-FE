import { useState } from "react";
import Swal from "sweetalert2";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Lectures = ({ lectures, sectionId, instructor, section, course, triggerRefresh }) => {
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
  const handleFileChangeForNewLecture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPendingFileForNewLecture(file);
      if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          const durationInSeconds = video.duration;
          const minutesRounded = Math.ceil(durationInSeconds / 60);
          setNewLecture((prev) => ({
            ...prev,
            duration: `${minutesRounded} mins`,
          }));
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type === "application/pdf") {
        setNewLecture((prev) => ({ ...prev, duration: "" }));
      }
    }
  };
  const handleComposeEmail = async (index) => {
    const lecture = lectures[index];
    const email = "tthoai2401.learn@gmail.com"; // Địa chỉ nhận email
    const subject = `Xác nhận phục hồi bài giảng bị khóa: ${lecture.title}`;

    const body = `ĐƠN XIN XEM XÉT PHỤC HỒI HOẠT ĐỘNG CHO BÀI GIẢNG\n
    THÔNG TIN BÀI GIẢNG:\n
    - ID BÀI GIẢNG: ${lecture.lecture_id}\n
    - TÊN BÀI GIẢNG: "${lecture.title.toUpperCase()}"\n
    - THUỘC CHƯƠNG: "${section.title.toUpperCase()}"\n
    - THUỘC KHÓA HỌC: "${course.title.toUpperCase()}"\n
    - GIẢNG VIÊN: ${instructor.firstName.toUpperCase()} ${instructor.lastName.toUpperCase()}\n
    - Email: ${instructor.email}\n
    - SỐ ĐIỆN THOẠI: ${instructor.phoneNumber}\n
    LÝ DO PHỤC HỒI:\n
    - \n
    - \n
    VUI LÒNG XỬ LÝ SỚM. XIN CHÂN THÀNH CẢM ƠN!`;

    const loginUrl = `https://accounts.google.com/AccountChooser?Email=${instructor.email}`;
    const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    const swalResult = await Swal.fire({
      title: "Xác nhận đăng nhập",
      text: `Bạn đã đăng nhập email?\nNên sử dụng email này "${instructor.email}" để được ưu tiên.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Tiếp tục",
      cancelButtonText: "Hủy",
    });

    if (swalResult.isDismissed) {
      return;
    }

    if (swalResult.isConfirmed) {
      window.open(composeUrl, "_blank");
    } else {
      window.open(loginUrl, "_blank");
      setTimeout(() => {
        window.open(composeUrl, "_blank");
      }, 3000);
    }
  };

  const handleFileChangeForEdit = (lectureId, e) => {
    const file = e.target.files[0];
    if (file) {
      setPendingFileForEdit((prev) => ({ ...prev, [lectureId]: file }));
      if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          const durationInSeconds = video.duration;
          const minutesRounded = Math.ceil(durationInSeconds / 60);
          setLectureList((prevList) =>
            prevList.map((lec) =>
              lec.lecture_id === lectureId
                ? { ...lec, duration: `${minutesRounded} mins` }
                : lec
            )
          );
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type === "application/pdf") {
        setLectureList((prevList) =>
          prevList.map((lec) =>
            lec.lecture_id === lectureId ? { ...lec, duration: "" } : lec
          )
        );
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
          `${baseUrl}/api/instructor/update-lecture/${lecture.lecture_id}`,
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
    if (
      !lecture.title.trim() ||
      !lecture.duration.trim() ||
      (lecture.content_type.toLowerCase() === "pdf" && !lecture.duration.trim())
    ) {
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
        `${baseUrl}/api/instructor/update-lecture/${lecture.lecture_id}`,
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
        `${baseUrl}/api/instructor/delete-lecture/${lectureId}`,
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
        title: "Thành công",
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
      !newLecture.duration ||
      (!newLecture.video_url &&
        !newLecture.document_url &&
        !pendingFileForNewLecture) ||
      (newLecture.content_type === "PDF" && !newLecture.duration)
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
        `${baseUrl}/api/instructor/add-lecture`,
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
        title: "Thành công",
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
          status: "true"
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
  const getDurationParts = (duration) => {
    if (!duration) return { value: "", unit: "mins" };
    const parts = duration.split(" ");
    return { value: parts[0], unit: parts[1] || "mins" };
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
              className={`flex flex-col sm:flex-row items-center justify-between p-4 border rounded-md hover:shadow-lg transition
                ${lecture.status ? "bg-white" : "bg-red-100"}`}
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
                          className={`p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full`}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold">
                          Duration
                        </label>
                        <p className="text-gray-500 text-sm italic">
                          Nhập thời gian (mins, hours).
                        </p>
                        <div className="flex">
                          <input
                            type="number"
                            placeholder="Duration"
                            value={getDurationParts(lecture.duration).value}
                            onChange={(e) => {
                              const value = e.target.value;
                              const { unit } = getDurationParts(
                                lecture.duration
                              );
                              if (!value) {
                                setLectureList((prev) => {
                                  const updated = [...prev];
                                  updated[index].duration = "";
                                  return updated;
                                });
                              } else {
                                setLectureList((prev) => {
                                  const updated = [...prev];
                                  updated[index].duration = `${value} ${unit}`;
                                  return updated;
                                });
                              }
                            }}
                            className="p-2 border border-gray-300 flex-1 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <select
                            value={getDurationParts(lecture.duration).unit}
                            disabled={!getDurationParts(lecture.duration).value}
                            onChange={(e) => {
                              const unit = e.target.value;
                              const { value } = getDurationParts(
                                lecture.duration
                              );
                              if (!value) return;
                              setLectureList((prev) => {
                                const updated = [...prev];
                                updated[index].duration = `${value} ${unit}`;
                                return updated;
                              });
                            }}
                            className="p-2 border-t border-b border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="mins">mins</option>
                            <option value="hours">hours</option>
                          </select>
                        </div>
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
                              handleFileChangeForEdit(lecture.lecture_id, e)
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

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
                      Watch PDF
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
                  {!lecture.status && (
                    <button
                      onClick={() => {
                        handleComposeEmail(index);
                      }}
                      className="border border-blue-500 text-blue-500 rounded px-2 py-1 hover:bg-blue-100 transition"
                      title="Gửi yêu cầu mở khóa section"
                    >
                      ✉
                    </button>
                  )}
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
          {pendingFileForNewLecture && (
            <div>
              <label className="block text-gray-700 font-bold">Duration</label>
              <p className="text-gray-500 text-sm italic">
                Nhập thời gian cần để học (mins, hours).
              </p>
            </div>
          )}
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
          {pendingFileForNewLecture &&
            (pendingFileForNewLecture.type.startsWith("video/") ? (
              <input
                type="text"
                value={newLecture.duration}
                readOnly
                className="p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
              />
            ) : (
              <div className="flex">
                <input
                  type="number"
                  placeholder="Duration"
                  value={getDurationParts(newLecture.duration).value}
                  onChange={(e) => {
                    const value = e.target.value;
                    const { unit } = getDurationParts(newLecture.duration);
                    if (!value) {
                      setNewLecture({
                        ...newLecture,
                        duration: "",
                      });
                    } else {
                      setNewLecture({
                        ...newLecture,
                        duration: `${value} ${unit}`,
                      });
                    }
                  }}
                  className="p-2 border border-gray-300 flex-1 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={getDurationParts(newLecture.duration).unit}
                  onChange={(e) => {
                    const unit = e.target.value;
                    const { value } = getDurationParts(newLecture.duration);
                    if (!value) return;
                    setNewLecture({
                      ...newLecture,
                      duration: `${value} ${unit}`,
                    });
                  }}
                  disabled={!getDurationParts(newLecture.duration).value}
                  className="p-2 border-t border-b border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="mins">mins</option>
                  <option value="hours">hours</option>
                </select>
              </div>
            ))}
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
    </div>
  );
};

export default Lectures;
