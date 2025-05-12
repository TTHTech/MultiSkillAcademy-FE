import { useState, useEffect } from "react";
import {
  FaSave,
  FaTimes,
  FaEdit,
  FaPlus,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const userId = Number(localStorage.getItem("userId"));
const App = () => {
  const [open, setOpen] = useState(true);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [course, setCourse] = useState({
    courseId: "",
    title: "",
    price: "",
    description: "",
    level: "Beginner",
    language: "",
    categoryName: "",
    duration: "",
    image: [],
  });
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const response = await fetch(
          `${baseUrl}/api/instructor/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const languages = [
    "English",
    "Vietnamese",
    "Chinese",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Korean",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",
    "Hindi",
    "Bengali",
    "Swedish",
    "Dutch",
    "Greek",
    "Hebrew",
    "Turkish",
    "Thai",
  ];
  const handleSaveCourse = async () => {
    if (
      !course.title ||
      !course.price ||
      !course.categoryName ||
      !course.description ||
      !course.level ||
      !course.language ||
      !course.duration
    ) {
      await Swal.fire({
        title: "Missing Fields",
        text: "Hãy điền đầy đủ thông tin khóa học",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (course.price == 0) {
      const result = await Swal.fire({
        title: "Confirmation",
        text: "Bạn muốn thêm khóa học miễn phí ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
    
      if (result.isConfirmed) {
        handleFinish();
      } else {
        return;
      }
    } else {
      handleFinish();
    }
    
  };

  const handleFinish = async () => {
    try {
      const addCourse = {
        courseId: "CR0" + Date.now(),
        categoryName: course.categoryName,
        instructor: userId,
        title: course.title,
        description: course.description,
        price: course.price,
        level: course.level,
        language: course.language,
        duration: course.duration,
        status: "Unsent",
        rating: 0,
        images: course.image,
      };

      console.log("Course Data:", addCourse);
      const response = await fetch(
        `${baseUrl}/api/instructor/add-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(addCourse),
        }
      );

      if (response.ok) {
        const data = await response.text();
        console.log("Response from API:", data);
        const swalResult = await Swal.fire({
          title: "Confirmation",
          text: data,
          icon: "success",
          confirmButtonText: "Yes",
        });
        if (swalResult) {
          navigate("/instructor/courses");
          window.location.reload();
        }
      } else {
        throw new Error("Failed to add course. Status: " + response.status);
      }
    } catch (error) {
      console.error("Error while adding course:", error);
      alert("Failed to add course. Please try again.");
    }
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value,
    });
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

  const handleAddImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setCurrentImageIndex(images.length);
      const uploadedImageUrl = await uploadImage(file);
      try {
        const addImage = {
          imageId: course.courseId + " " + Date.now(),
          imageURL: uploadedImageUrl,
          newImageURL: "",
          name: "Image " + course.courseId,
        };

        const response = await fetch(
          `${baseUrl}/api/instructor/addImage`,
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
          throw new Error("Failed to add Image. Status: " + response.status);
        }
        await Swal.fire({
          title: "Confirmation",
          text: "Thêm ảnh thành công.",
          icon: "success",
          confirmButtonText: "Yes",
        });

        setImages((prevImages) => {
          const newImages = [...prevImages, uploadedImageUrl];
          setCourse((prevCourse) => ({ ...prevCourse, image: newImages }));
          return newImages;
        });
      } catch (error) {
        console.error("Error while adding image:", error);
        alert("Failed to add image. Please try again.");
      }
    }
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

      try {
        const editImage = {
          imageId: "",
          imageURL: oldImageUrl,
          name: `Image ${currentImageIndex + 1}`,
          newImageURL: newImageUrl,
        };

        const response = await fetch(
          `${baseUrl}/api/instructor/updateImage`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(editImage),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update image.");
        }
        await Swal.fire({
          title: "Confirmation",
          text: "Cập nhật hình ảnh thành công!",
          icon: "success",
          confirmButtonText: "Yes",
        });
        setImages(updatedImages);
        setCourse((prevCourse) => ({ ...prevCourse, image: updatedImages }));
      } catch (error) {
        console.error("Lỗi:", error);
        await Swal.fire({
          title: "Confirmation",
          text: "Lỗi khi cập nhật hình ảnh",
          icon: "error",
          confirmButtonText: "Yes",
        });
      }
    }
  };

  const handleDeleteImage = async () => {
    const imageToDelete = images[currentImageIndex];
    const updatedImages = images.filter(
      (_, index) => index !== currentImageIndex
    );

    try {
      const response = await fetch(
        `${baseUrl}/api/instructor/deleteImage`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ imageURL: imageToDelete }),
        }
      );

      if (!response.ok) {
        throw new Error("Xóa hình ảnh thất bại.");
      }
      await Swal.fire({
        title: "Confirmation",
        text: "Xóa hình ảnh thành công!",
        icon: "success",
        confirmButtonText: "Yes",
      });
      setImages(updatedImages);
      setCourse((prevCourse) => ({ ...prevCourse, image: updatedImages }));
      setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } catch (error) {
      console.error("Lỗi:", error);
      await Swal.fire({
        title: "Confirmation",
        text: "Lỗi khi xóa hình ảnh.",
        icon: "error",
        confirmButtonText: "Yes",
      });
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ImageUploat");
    formData.append("cloud_name", "due2txjv1");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/due2txjv1/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading the image", error.response.data);
      alert(
        `Error uploading the image: ${JSON.stringify(error.response.data)}`
      );
      return null;
    }
  };
  return (
    <section
      className={`m-3 text-base text-gray-900 font-normal duration-300 flex-1 ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} />
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Thêm khóa học mới
          </h1>
          <div className="relative mb-6">
            {images.length >= 0 && (
              <>
                <img
                  src={
                    images.length > 0
                      ? images[currentImageIndex]
                      : "https://placehold.co/6600x200"
                  }
                  alt={course?.title || "Course image"}
                  className="w-full h-60 object-cover rounded-lg mb-6"
                />
                <label className="absolute top-2 left-2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors cursor-pointer">
                  <FaPlus />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImage}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 bg-red-700 text-white p-2 rounded-full shadow-md hover:bg-red-800 transition-colors"
                >
                  <FaTimes />
                </button>

                <button
                  onClick={handleEditImage}
                  className="absolute top-2 right-10 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                >
                  <FaArrowLeft />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="title">
                  Tiêu đề
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
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="price">
                  Giá (VND)
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

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                Mô tả
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="level">
                  Cấp độ
                </label>
                <select
                  id="level"
                  name="level"
                  value={course.level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Cơ bản</option>
                  <option value="Intermediate">Trung cấp</option>
                  <option value="Advanced">Nâng cao</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="language">
                  Ngôn ngữ
                </label>
                <select
                  id="language"
                  name="language"
                  value={course.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Chọn ngôn ngữ
                  </option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="categoryName"
              >
                Danh mục
              </label>
              <select
                id="categoryName"
                name="categoryName"
                value={course.categoryName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Chọn một danh mục
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="duration">
                Thời gian
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                value={course.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSaveCourse}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:bg-blue-600 transition-colors"
              >
                <FaSave className="mr-2" /> Lưu khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
