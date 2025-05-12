import { useState, useRef } from "react";
import Swal from "sweetalert2";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Images = ({ images = [], courseId, triggerRefresh}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef(null);
  const [fileAction, setFileAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  
  const handleButtonClick = () => {
    setFileAction("add");
    fileInputRef.current.click();
  };
  const handleEditButtonClick = () => {
    setFileAction("edit");
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (!e || !e.target || !e.target.files) {
      console.error("File input event is undefined or missing files");
      return;
    }
    const file = e.target.files[0];
    if (!file) return;
    if (fileAction === "add") {
      await handleAddImage(file);
    } else if (fileAction === "edit") {
      await handleEditImage(file);
    }
  };
  

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        `${baseUrl}/api/cloudinary/upload/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi upload image");
      }
      const imageUrl = await response.text();
      return imageUrl;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAddImage = async (file) => {
    if (file) {
      setIsLoading(true);
      const uploadedImageUrl = await handleUpload(file);
      try {
        const addImage = {
          imageId: courseId + " " + Date.now(),
          imageURL: uploadedImageUrl,
          newImageURL: "",
          name: "Image " + courseId,
        };
        const response = await fetch(
          `${baseUrl}/api/instructor/addImage/${courseId}`,
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
        setIsLoading(false);
        triggerRefresh();
        const data = await response.text();
        await Swal.fire({
          title: "Confirmation",
          text: "Thêm hình ảnh thành công!",
          icon: "success",
          confirmButtonText: "Yes",
        });
        console.log("Response from API:", data);
      } catch (error) {
        setIsLoading(false);
        console.error("Error while adding course:", error);
        alert("Failed to add image. Please try again.");
      }
    }
  };
  const handleDeleteImage = async (imageToDelete) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/instructor/deleteImage/${courseId}`,
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
      setIsLoading(false);
      triggerRefresh();
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
      setIsLoading(false);
      console.error("Lỗi:", error);
      alert("Lỗi khi xóa hình ảnh");
    }
  };
  const handleEditImage = async (file) => {
    setIsLoading(true);
    if (file) {
      const currentImageUrl = images[currentIndex];
      const uploadedImageUrl = await handleUpload(file);
      const editImage = {
        imageId: "",
        imageURL: currentImageUrl,
        name: "Image " + courseId,
        newImageURL: uploadedImageUrl,
      };
      try {
        const response = await fetch(
          `${baseUrl}/api/instructor/updateImage/${courseId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(editImage),
          }
        );
        setIsLoading(false);
        triggerRefresh();
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
        setIsLoading(false);
        console.error("Lỗi:", error);
        alert("Lỗi khi cập nhật hình ảnh");
      }
    }
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-semibold mb-2">Hình ảnh khóa học</h2>
      <p className="text-gray-500 text-sm italic">
        Chú ý hình ảnh được thêm cuối cùng sẽ là hình ảnh đại diện được hiển thị
        làm ảnh chính (Hình ảnh thứ nhất).
      </p>
      <div className="grid grid-cols-10 gap-6 mt-4">
        <div className="col-span-6 flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={images[currentIndex]}
              alt={`Course ${currentIndex}`}
              className="object-cover rounded-md shadow-md"
            />
            <button
              onClick={handleEditButtonClick}
              className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 focus:outline-none"
            >
              Sửa
            </button>
            <button
              onClick={() => handleDeleteImage(images[currentIndex])}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 focus:outline-none"
            >
              Xóa
            </button>
          </div>

          <div className="flex items-center justify-between w-full">
            <button
              onClick={handlePrev}
              className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              Trước
            </button>
            <p className="text-gray-600 text-sm italic text-center">
              Đang xem ảnh thứ {currentIndex + 1} / {images.length}
            </p>
            <button
              onClick={handleNext}
              className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              Sau
            </button>
          </div>
        </div>
        <div className="col-span-4 flex flex-col justify-start">
          <p className="text-base text-black mb-4">
            Tải hình ảnh khóa học lên tại đây. Để được chấp nhận, hình ảnh phải
            đáp ứng tiêu chuẩn chất lượng (750x422 px, .jpg, .jpeg, .gif, .png)
          </p>
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 border border-purple-500 text-purple-600 rounded-md hover:bg-purple-100 transition"
          >
            Chọn và tải ảnh lên
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Images;