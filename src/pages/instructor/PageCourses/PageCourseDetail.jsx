import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import ButtonBack from "../../../components/instructor/BackButton/BackButton";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

const PageCourseDetail = () => {
  const [open, setOpen] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const fetchCourseData = async () => {
      console.log(localStorage.getItem("token"));
      try {
        const response = await fetch(
          `http://localhost:8080/api/instructor/courses/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ); // Gọi API
        const data = await response.json();
        setCourse(data); // Gán dữ liệu từ API vào state course
        setImages(data.images || []);
        setOriginalCourseData(data);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setIsLoading(false); // Tắt trạng thái loading sau khi gọi API
      }
    };

    fetchCourseData();
  }, [id]);

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedSectionTitle, setEditedSectionTitle] = useState("");
  const [editingLecture, setEditingLecture] = useState(null);
  const [editedLecture, setEditedLecture] = useState({
    lectureOrder: null,
    title: "",
    video_url: "",
    document_url: "",
    content_type: "Video",
    duration: "",
  });
  const [addingLecture, setAddingLecture] = useState(null);
  const [newLecture, setNewLecture] = useState({
    title: "",
    video_url: "",
    document_url: "",
    content_type: "Video",
    duration: "",
  });
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const LoadingFile = () => {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50">
        <p className="text-xl font-bold text-gray-700 animate-pulse">
          Loading file, please wait...
        </p>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
  };

  const handleSave = async () => {
    let errorMessages = [];

    if (!course.title) errorMessages.push("Title is required.");
    if (!course.price) errorMessages.push("Price is required.");
    if (!course.description) errorMessages.push("Description is required.");
    if (!course.level) errorMessages.push("Level is required.");
    if (!course.language) errorMessages.push("Language is required.");
    if (!course.category) errorMessages.push("Category is required.");
    if (!course.duration) errorMessages.push("Duration is required.");

    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return;
    }

    const UpdateCourse = {
      title: course.title,
      price: course.price,
      description: course.description,
      level: course.level,
      language: course.language,
      duration: course.duration,
      categoryName: course.category,
    };
    try {
      // Gọi API cập nhật Section
      const response = await fetch(
        `http://localhost:8080/api/instructor/update-course/${course.courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(UpdateCourse),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course");
      }
      const result = await response.text();
      const swalResult = await Swal.fire({
        title: "Confirmation",
        text: result,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Yes",
      });
      if (swalResult) {
        window.location.reload();
      }
      console.log(result);
      setEditingSectionId(null);
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course: " + error.message);
    }
    console.log("Course data saved:", course);
    setIsEditing(false);
  };
  const [originalCourseData, setOriginalCourseData] = useState(null); // Lưu dữ liệu gốc từ API
  const handleCancel = () => {
    if (originalCourseData) {
      setCourse(originalCourseData); // Khôi phục lại dữ liệu gốc từ API
    }
    setIsEditing(false);
    setEditingSectionId(null);
    setEditingLecture(null);
    setAddingLecture(null);
  };

  const handleAddSection = async () => {
    if (!newSectionTitle) {
      alert("Please enter a section title.");
      return;
    }

    const newSection = {
      sectionId: id + Date.now(),
      courseId: course.courseId,
      title: newSectionTitle,
      sectionOrder: course.sections.length + 1,
      lectures: [],
    };
    try {
      // Gọi API thêm Section
      const response = await fetch(
        "http://localhost:8080/api/instructor/add-section",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newSection),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add section");
      }

      const result = await response.text();
      const swalResult = await Swal.fire({
        title: "Confirmation",
        text: result,
        icon: "success",
        confirmButtonText: "Yes",
      });
      if (swalResult) {
        window.location.reload();
      }
      console.log(result);

      // setCourse((prevCourse) => ({
      //   ...prevCourse,
      //   sections: [...prevCourse.sections, newSection],
      // }));
      setNewSectionTitle("");
    } catch (error) {
      console.error("Error adding section:", error);
      alert("Error adding section: " + error.message);
    }
  };

  const handleEditSection = (section_id) => {
    const sectionToEdit = course.sections.find(
      (section) => section.section_id === section_id
    );
    setEditingSectionId(section_id);
    setEditedSectionTitle(sectionToEdit.title);
  };

  const handleSaveSection = async (section_id) => {
    if (!editedSectionTitle) {
      alert("Please enter a section title.");
      return;
    }

    const updatedSection = {
      sectionId: section_id,
      title: editedSectionTitle,
      sectionOrder: course.sections.find(
        (section) => section.section_id === section_id
      ).sectionOrder,
    };

    try {
      // Gọi API cập nhật Section
      const response = await fetch(
        `http://localhost:8080/api/instructor/update-section/${section_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedSection),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update section");
      }

      const result = await response.text();
      const swalResult = await Swal.fire({
        title: "Confirmation",
        text: result,
        icon: "success",
        confirmButtonText: "Yes",
      });
      if (swalResult) {
        window.location.reload();
      }
      console.log(result);

      // setCourse((prevCourse) => ({
      //   ...prevCourse,
      //   sections: prevCourse.sections.map((section) =>
      //     section.section_id === section_id
      //       ? { ...section, title: editedSectionTitle }
      //       : section
      //   ),
      // }));

      setEditingSectionId(null);
    } catch (error) {
      console.error("Error updating section:", error);
      alert("Error updating section: " + error.message);
    }
  };

  const handleDeleteSection = async (section_id) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text:
        "Bạn có chắc chắn muốn xóa Section này không? \n" +
        "Nếu xóa Section các bài học bên trong đều bị xóa theo và không thể khôi phục hãy chú ý!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }

    try {
      // Gọi API xóa Section
      const response = await fetch(
        `http://localhost:8080/api/instructor/delete-section/${section_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete section");
      }

      const result = await response.text();
      const swalResult = await Swal.fire({
        title: "Confirmation",
        text: result,
        icon: "success",
        confirmButtonText: "Yes",
      });
      if (swalResult) {
        window.location.reload();
      }
      console.log(result);
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Error deleting section: " + error.message);
    }
  };

  const handleEditLecture = (section_id, lecture_id) => {
    const section = course.sections.find(
      (section) => section.section_id === section_id
    );
    const lectureToEdit = section.lectures.find(
      (lecture) => lecture.lecture_id === lecture_id
    );
    setEditingLecture({ section_id, lecture_id });
    setEditedLecture({
      title: lectureToEdit.title,
      video_url: lectureToEdit.video_url,
      document_url: lectureToEdit.document_url,
      content_type: lectureToEdit.content_type,
      duration: lectureToEdit.duration,
    });
  };

  const handleSaveLecture = async (lecture_id, section_id, lecture_Order) => {
    const { title, video_url, document_url, content_type, duration } =
      editedLecture;
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn sửa bài học này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    if (!title) {
      alert("Please enter a title.");
      return;
    }
    if (!content_type) {
      alert("Please select a content type.");
      return;
    }
    if (content_type.toLowerCase() === "video" && !video_url) {
      alert("Please enter a video URL.");
      return;
    }
    if (content_type.toLowerCase() === "pdf" && !document_url) {
      alert("Please enter a document URL.");
      return;
    }
    if (!duration) {
      alert("Please enter the duration.");
      return;
    }
    const updatedLecture = {
      lectureId: lecture_id,
      sectionId: section_id,
      title: title,
      contentType: content_type,
      videoUrl: video_url,
      documentUrl: document_url,
      duration: duration,
      lectureOrder: lecture_Order,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/instructor/update-lecture/${lecture_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedLecture),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update lecture.");
      }

      const result = await response.text();
      const swalResult = await Swal.fire({
        title: "Confirmation",
        text: result,
        icon: "success",
        confirmButtonText: "Yes",
      });
      if (swalResult) {
        window.location.reload();
      }
      setEditingLecture(null);
    } catch (error) {
      console.error("Error updating lecture:", error);
      alert("An error occurred while updating the lecture.");
    }
  };

  const handleDeleteLecture = async (section_id, lecture_id) => {
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text:
        "Bạn có chắc chắn muốn xóa bài học này không? \n" +
        "Việc xóa bài học sẽ không thể khôi phục lại, bạn hãy chú ý!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/instructor/delete-lecture/${lecture_id}`,
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
      const swalResult = await Swal.fire({
        title: "Confirmation",
        text: result,
        icon: "success",
        confirmButtonText: "Yes",
      });
      if (swalResult) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };

  const handleAddLecture = async (section_id) => {
    const { title, video_url, document_url, content_type, duration } =
      newLecture;
    let errorMessages = [];

    if (!title) errorMessages.push("Please enter a lecture title.");
    if (!content_type) {
      errorMessages.push("Please select a content type.");
    } else if (content_type.toLowerCase() === "video" && !video_url) {
      errorMessages.push("Please enter a video URL.");
    } else if (content_type.toLowerCase() === "pdf" && !document_url) {
      errorMessages.push("Please enter a document URL.");
    }

    if (!duration) errorMessages.push("Please enter the duration.");

    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return;
    }

    const newLectureData = {
      lectureId: section_id + " " + Date.now(),
      sectionId: section_id,
      title: title,
      contentType: content_type,
      videoUrl: video_url,
      documentUrl: document_url,
      duration: duration,
      lectureOrder:
        course.sections.find((section) => section.section_id === section_id)
          .lectures.length + 1,
    };
    console.log("newLecture: ", newLectureData);

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

      if (response.ok) {
        const result = await response.text();
        const swalResult = await Swal.fire({
          title: "Confirmation",
          text: result,
          icon: "success",
          confirmButtonText: "Yes",
        });
        if (swalResult) {
          window.location.reload();
        }
        setNewLecture({
          title: "",
          video_url: "",
          document_url: "",
          content_type: "Video",
          duration: "",
        });
        setAddingLecture(null);
      } else {
        alert("Failed to add lecture");
      }
    } catch (error) {
      console.error("Error adding lecture:", error);
      alert("An error occurred while adding the lecture");
    }
  };

  const handleChangeNewLecture = (e) => {
    const { name, value } = e.target;
    setNewLecture((prevLecture) => ({ ...prevLecture, [name]: value }));
  };

  const handleAddImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setCurrentImageIndex(images.length); // Chuyển sang ảnh mới
      const uploadedImageUrl = await uploadImage(file);
      try {
        const addImage = {
          imageId: course.courseId + " " + Date.now(),
          imageURL: uploadedImageUrl,
          newImageURL: "",
          name: "Image " + course.courseId,
        };
        const response = await fetch(
          `http://localhost:8080/api/instructor/addImage/${course.courseId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(addImage),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add Image Status: " + response.status);
        }

        const data = await response.text();
        await Swal.fire({
          title: "Confirmation",
          text: "Image added successfully!",
          icon: "success",
          confirmButtonText: "Yes",
        });
        console.log("Response from API:", data);
      } catch (error) {
        console.error("Error while adding course:", error);
        alert("Failed to add image. Please try again.");
      }
      if (uploadedImageUrl) {
        setImages((prevImages) => [...prevImages, uploadedImageUrl]); 
      }
    }
  };

  const handleDeleteImage = async () => {
    const imageToDelete = images[currentImageIndex];
    const updatedImages = images.filter(
      (_, index) => index !== currentImageIndex
    );
    setImages(updatedImages);
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));

    try {
      const response = await fetch(
        `http://localhost:8080/api/instructor/deleteImage/${course.courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            imageURL: imageToDelete,
          }),
        }
      );

      if (response.ok) {
        await Swal.fire({
          title: "Confirmation",
          text: "Xóa hình ảnh thành công!",
          icon: "success",
          confirmButtonText: "Yes",
        });
      } else {
        throw new Error("Xóa hình ảnh thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi khi xóa hình ảnh");
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleEditImage = async () => {
    const newImageUrl = prompt(
      "Enter the new image URL: ",
      images[currentImageIndex]
    );

    if (newImageUrl) {
      const oldImageUrl = images[currentImageIndex];

      const updatedImages = images.map((img, index) =>
        index === currentImageIndex ? newImageUrl : img
      );
      setImages(updatedImages);
      const editImage = {
        imageId: "",
        imageURL: oldImageUrl,
        name: `Image ${currentImageIndex + 1}`,
        newImageURL: newImageUrl,
      };
      try {
        const response = await fetch(
          `http://localhost:8080/api/instructor/updateImage/${course.courseId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(editImage),
          }
        );

        if (response.ok) {
          await Swal.fire({
            title: "Confirmation",
            text: "Cập nhật hình ảnh thành công!",
            icon: "success",
            confirmButtonText: "Yes",
          });
        } else {
          throw new Error("Cập nhật hình ảnh thất bại");
        }
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi khi cập nhật hình ảnh");
      }
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ImageUploat"); // Thay thế với upload preset của bạn
    formData.append("cloud_name", "due2txjv1"); // Thay thế với cloud name của bạn

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/due2txjv1/image/upload",
        formData
      );
      return response.data.secure_url; // Trả về URL ảnh đã upload
    } catch (error) {
      console.error("Error uploading the image", error.response.data); // Hiển thị thông báo lỗi chi tiết
      alert(
        `Error uploading the image: ${JSON.stringify(error.response.data)}`
      ); // Hiển thị thông báo lỗi cho người dùng
      return null; // Trả về null nếu có lỗi
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>No course data available</div>;
  }
  return (
    <section
      className={`m-3 text-base text-gray-900 font-normal duration-300 flex-1 ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} />
      <div className="container mx-auto p-4">
        <ButtonBack />

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Course Details
          </h1>

          <div className="relative mb-6">
            {/* Hiển thị ảnh hiện tại */}
            {images.length >= 0 && (
              <>
                <img
                  src={images[currentImageIndex] || "default-image.jpg"}
                  alt={course?.title || "Course image"}
                  className="w-full h-60 object-cover rounded-lg mb-6"
                />

                {/* Nút thêm ảnh */}
                <label className="absolute top-2 left-2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors cursor-pointer">
                  <FaPlus />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImage}
                    className="hidden"
                  />
                </label>

                {/* Nút xóa ảnh */}
                <button
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 bg-red-700 text-white p-2 rounded-full shadow-md hover:bg-red-800 transition-colors"
                >
                  <FaTimes />
                </button>

                {/* Nút sửa ảnh */}
                <button
                  onClick={handleEditImage}
                  className="absolute top-2 right-10 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                >
                  <FaEdit />
                </button>

                {/* Nút chuyển ảnh trước */}
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                >
                  <FaArrowLeft />
                </button>

                {/* Nút chuyển ảnh sau */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Edit Course
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* title */}
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={course.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* price */}
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="price">
                    Price (VND)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={course.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* description */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="6"
                />
              </div>
              {/* level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="level">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={course.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="language"
                  >
                    Language
                  </label>
                  <input
                    id="language"
                    name="language"
                    type="text"
                    value={course.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="duration"
                  >
                    Duration (hours)
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    value={course.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={course.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* button Save Cancel */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:bg-blue-600 transition-colors"
                >
                  <FaSave className="mr-2" /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:bg-gray-600 transition-colors"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {course.title}
              </h2>
              <p className="text-gray-700 text-lg mb-6">{course.description}</p>
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      color={index < course.rating ? "#FFD700" : "#e4e5e9"}
                      className="text-xl"
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-lg ml-2">
                  {course.rating}
                </span>
              </div>
              <div className="text-lg font-semibold text-indigo-700 mb-6">
                {new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(
                  course.price
                )}{" "}
                VND
              </div>
              <div className="text-gray-600 text-sm mb-2">
                Level: {course.level}
              </div>
              <div className="text-gray-600 text-sm mb-2">
                Language: {course.language}
              </div>
              <div className="text-gray-600 text-sm mb-2">
                Duration: {course.duration} hours
              </div>
              <div className="text-gray-600 text-sm mb-2">
                Category: {course.category}
              </div>
              <div className="text-gray-600 text-sm mb-2">
                Created At: {moment(course.created_at).format("DD-MM-YYYY")}
              </div>
              <div className="text-gray-600 text-sm mb-6">
                Updated At: {moment(course.updated_at).format("DD-MM-YYYY")}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Sections & Lectures
          </h2>

          <div className="mb-4 flex items-center space-x-3">
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="New section title"
              className="px-3 py-2 border border-gray-300 rounded-lg flex-grow"
            />
            <button
              onClick={handleAddSection}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-600 transition-colors"
            >
              <FaPlus className="mr-2 text-sm" /> Add Section
            </button>
          </div>

          {course.sections.map((section) => (
            <div key={section.section_id} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {editingSectionId === section.section_id ? (
                  <div className="mb-4 flex items-center space-x-4">
                    <input
                      type="text"
                      value={editedSectionTitle}
                      onChange={(e) => setEditedSectionTitle(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg flex-grow"
                    />
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleSaveSection(section.section_id)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center shadow-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out"
                      >
                        <FaSave className="mr-2 text-lg" /> Save
                      </button>
                      <button
                        onClick={() => setEditingSectionId(null)}
                        className="bg-gray-600 text-white px-5 py-2 rounded-lg flex items-center shadow-lg hover:bg-gray-700 transition-colors duration-200 ease-in-out"
                      >
                        <FaTimes className="mr-2 text-lg" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {section.title}
                    </h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEditSection(section.section_id)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.section_id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrashAlt />
                      </button>
                      <button
                        onClick={() => setAddingLecture(section.section_id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-600 transition-colors"
                      >
                        <FaPlus className="mr-2" /> Add Lectures
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="pl-4">
                {addingLecture === section.section_id && (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Add New Lecture
                    </h4>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="Lecturetitle"
                    >
                      Title
                    </label>
                    <input
                      id="Lecturetitle"
                      type="text"
                      name="title"
                      value={newLecture.title}
                      onChange={handleChangeNewLecture}
                      placeholder="Lecture Title"
                      className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                    />
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="Lecturecontent_type"
                    >
                      Content type
                    </label>
                    <select
                      id="Lecturecontent_type"
                      name="content_type"
                      value={newLecture.content_type}
                      onChange={handleChangeNewLecture}
                      className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                    >
                      <option value="Video">Video</option>
                      <option value="PDF">PDF</option>
                    </select>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="Lecturecontent_url"
                    >
                      Content url
                    </label>
                    {/* Thêm mới bài học */}
                    {/* Upload Video */}
                    {newLecture.content_type?.toLowerCase() === "video" && (
                      <div>
                        <input
                          id="Lecturecontent_url"
                          type="file"
                          accept="video/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("upload_preset", "ImageUploat"); // Thay bằng upload preset của bạn
                            formData.append("cloud_name", "due2txjv1"); // Thay bằng Cloud name của bạn

                            setIsLoadingFile(true); // Bắt đầu loading

                            try {
                              const response = await axios.post(
                                "https://api.cloudinary.com/v1_1/due2txjv1/video/upload", // API upload cho video
                                formData
                              );
                              setNewLecture({
                                ...newLecture,
                                video_url: response.data.secure_url,
                              });
                            } catch (error) {
                              console.error("Error uploading the video", error);
                            } finally {
                              setIsLoadingFile(false); // Tắt loading
                            }
                          }}
                          className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                        />
                        {isLoadingFile && <LoadingFile />}{" "}
                        {/* Hiển thị loading khi upload */}
                        {newLecture.video_url && (
                          <p>Uploaded Video URL: {newLecture.video_url}</p>
                        )}
                      </div>
                    )}

                    {/* Upload PDF */}
                    {newLecture.content_type?.toLowerCase() === "pdf" && (
                      <div>
                        <input
                          id="Lecturecontent_url"
                          type="file"
                          accept="application/pdf"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("upload_preset", "ImageUploat"); // Thay bằng upload preset của bạn
                            formData.append("cloud_name", "due2txjv1"); // Thay bằng Cloud name của bạn

                            setIsLoadingFile(true); // Bắt đầu loading

                            try {
                              const response = await axios.post(
                                "https://api.cloudinary.com/v1_1/due2txjv1/raw/upload", // API upload cho PDF
                                formData
                              );
                              setNewLecture({
                                ...newLecture,
                                document_url: response.data.secure_url,
                              });
                            } catch (error) {
                              console.error("Error uploading the PDF", error);
                            } finally {
                              setIsLoadingFile(false); // Tắt loading
                            }
                          }}
                          className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                        />
                        {isLoadingFile && <LoadingFile />}{" "}
                        {/* Hiển thị loading khi upload */}
                        {newLecture.document_url && (
                          <p>Uploaded PDF URL: {newLecture.document_url}</p>
                        )}
                      </div>
                    )}

                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="LectureDuration"
                    >
                      Duration
                    </label>
                    <input
                      id="LectureDuration"
                      type="number"
                      name="duration"
                      value={newLecture.duration}
                      onChange={handleChangeNewLecture}
                      placeholder="Duration (mins)"
                      className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                    />
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => handleAddLecture(section.section_id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-600 transition-colors"
                      >
                        <FaSave className="mr-2" /> Save Lecture
                      </button>
                      <button
                        onClick={() => setAddingLecture(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-gray-600 transition-colors"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {section.lectures.map((lecture) => (
                  <div
                    key={lecture.lecture_id}
                    className="border border-gray-300 rounded-lg p-4 mb-2 bg-gray-50"
                  >
                    {editingLecture &&
                    editingLecture.lecture_id === lecture.lecture_id &&
                    editingLecture.section_id === section.section_id ? (
                      <>
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="Lecturetitle"
                        >
                          Title
                        </label>
                        <input
                          id="Lecturetitle"
                          type="text"
                          name="title"
                          value={editedLecture.title}
                          onChange={(e) =>
                            setEditedLecture((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                        />
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="Lecturecontent_type"
                        >
                          Content type
                        </label>
                        <select
                          id="Lecturecontent_type"
                          name="content_type"
                          value={editedLecture.content_type}
                          onChange={(e) =>
                            setEditedLecture((prev) => ({
                              ...prev,
                              content_type: e.target.value,
                            }))
                          }
                          className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                        >
                          <option value="Video">Video</option>
                          <option value="PDF">PDF</option>
                        </select>
                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="Lecturecontent_url"
                        >
                          Content url
                        </label>

                        {/* Sửa bài học */}
                        {editedLecture.content_type?.toLowerCase() ===
                          "video" && (
                          <div>
                            <input
                              id="Lecturecontent_url"
                              type="file"
                              accept="video/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("upload_preset", "ImageUploat"); // Thay bằng upload preset của bạn
                                formData.append("cloud_name", "due2txjv1"); // Thay bằng Cloud name của bạn

                                setIsLoadingFile(true); // Bắt đầu loading

                                try {
                                  const response = await axios.post(
                                    "https://api.cloudinary.com/v1_1/due2txjv1/video/upload", // API upload cho video
                                    formData
                                  );
                                  setEditedLecture((prev) => ({
                                    ...prev,
                                    video_url: response.data.secure_url,
                                  }));
                                } catch (error) {
                                  console.error(
                                    "Error uploading the video",
                                    error
                                  );
                                } finally {
                                  setIsLoadingFile(false); // Tắt loading
                                }
                              }}
                              className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                            />
                            {isLoadingFile && <LoadingFile />}{" "}
                            {/* Hiển thị loading khi upload */}
                            {editedLecture.video_url && (
                              <p>
                                Uploaded Video URL: {editedLecture.video_url}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Upload PDF for editedLecture */}
                        {editedLecture.content_type?.toLowerCase() ===
                          "pdf" && (
                          <div>
                            <input
                              id="Lecturecontent_url"
                              type="file"
                              accept="application/pdf"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("upload_preset", "ImageUploat"); // Thay bằng upload preset của bạn
                                formData.append("cloud_name", "due2txjv1"); // Thay bằng Cloud name của bạn

                                setIsLoadingFile(true); // Bắt đầu loading

                                try {
                                  const response = await axios.post(
                                    "https://api.cloudinary.com/v1_1/due2txjv1/raw/upload", // API upload cho PDF
                                    formData
                                  );
                                  setEditedLecture((prev) => ({
                                    ...prev,
                                    document_url: response.data.secure_url,
                                  }));
                                } catch (error) {
                                  console.error(
                                    "Error uploading the PDF",
                                    error
                                  );
                                } finally {
                                  setIsLoadingFile(false); // Tắt loading
                                }
                              }}
                              className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                            />
                            {isLoadingFile && <LoadingFile />}{" "}
                            {/* Hiển thị loading khi upload */}
                            {editedLecture.document_url && (
                              <p>
                                Uploaded PDF URL: {editedLecture.document_url}
                              </p>
                            )}
                          </div>
                        )}

                        <label
                          className="block text-gray-700 mb-2"
                          htmlFor="LectureDuration"
                        >
                          Duration
                        </label>
                        <input
                          id="LectureDuration"
                          type="text"
                          name="duration"
                          value={editedLecture.duration}
                          onChange={(e) =>
                            setEditedLecture((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                          className="block mb-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
                        />
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() =>
                              handleSaveLecture(
                                lecture.lecture_id,
                                section.section_id,
                                lecture.lectureOrder
                              )
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-600 transition-colors"
                          >
                            <FaSave className="mr-2" /> Save
                          </button>
                          <button
                            onClick={() => setEditingLecture(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-gray-600 transition-colors"
                          >
                            <FaTimes className="mr-2" /> Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {lecture.title}
                        </h4>
                        <p className="text-gray-600">
                          Type: {lecture.content_type}
                        </p>
                        {lecture.content_type?.toLowerCase() === "video" && (
                          <a
                            href={lecture.video_url}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Watch Video
                          </a>
                        )}
                        {lecture.content_type?.toLowerCase() === "pdf" && (
                          <a
                            href={lecture.document_url}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download PDF
                          </a>
                        )}
                        <p className="text-gray-600">
                          Duration: {lecture.duration} mins
                        </p>
                        <div className="flex justify-end space-x-4 mt-2">
                          <button
                            onClick={() =>
                              handleEditLecture(
                                section.section_id,
                                lecture.lecture_id
                              )
                            }
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteLecture(
                                section.section_id,
                                lecture.lecture_id
                              )
                            }
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PageCourseDetail;
