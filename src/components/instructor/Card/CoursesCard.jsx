import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaEdit,
  FaTimes,
  FaUndo,
  FaSync,
  FaTrash,
  FaPaperPlane,
} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const CourseCard = ({
  courseId,
  images,
  title,
  description,
  rating,
  price,
  status,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [courseStatus, setCourseStatus] = useState(status);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 50000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleMouseEnter = () => setShowDetails(true);
  const handleMouseLeave = () => setShowDetails(false);

  const renderStars = () =>
    Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        color={index < rating ? "#FFD700" : "#e4e5e9"}
        className="text-xs"
      />
    ));

  const renderStatusIndicator = () => {
    switch (courseStatus) {
      case "Active":
        return <span className="text-green-500 font-semibold">Active</span>;
      case "Inactive":
        return <span className="text-red-500 font-semibold">Inactive</span>;
      case "Processing":
        return (
          <span className="text-yellow-500 font-semibold">Processing</span>
        );
      case "Unsent":
        return <span className="text-orange-500 font-semibold">Unsent</span>;
      case "Declined":
        return <span className="text-purple-500 font-semibold">Declined</span>;
      default:
        return <span className="text-gray-500 font-semibold">Unknown</span>;
    }
  };

  const handleChangeStatus = async (event) => {
    event.stopPropagation();
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn đổi trạng thái khóa học không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    try {
      const response = await axios.put(
        `https://educoresystem-1.onrender.com/api/instructor/changeStatus/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data) {
        setCourseStatus(response.data.newStatus);
        const swalResult = await Swal.fire({
          title: "Confirmation",
          text: "Chuyển đổi trạng thái khóa học thành công",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Yes",
        });
        if (swalResult) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error changing status:", error);
      alert("Failed to change course status");
    }
  };
  const handleDeleteCourse = async (event) => {
    event.stopPropagation();
    const swalResult = await Swal.fire({
      title: "Confirmation",
      text: "Bạn có chắc chắn muốn xóa khóa học này không ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalResult.isDismissed) {
      return;
    }
    const coursesId = courseId;
    try {
      const response = await fetch(
        `https://educoresystem-1.onrender.com/api/instructor/delete-course/${coursesId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.text();
        console.log("Response from API:", data);
        const swalResult = await Swal.fire({
          title: "Confirmation",
          text: data,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Yes",
        });
        if (swalResult) {
          window.location.reload();
        }
      } else {
        throw new Error(`Failed to delete course. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error while deleting course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const renderButtons = () => {
    const buttonClass =
      "flex items-center justify-center text-white text-sm px-3 py-1 rounded-md shadow-md transition-transform duration-200";

    switch (courseStatus) {
      case "Active":
        return (
          <div className="flex space-x-2 mt-2">
            <button
              className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}
              aria-label="Edit course"
            >
              <FaEdit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              className={`${buttonClass} bg-red-500 hover:bg-red-600`}
              aria-label="Cancel course"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleChangeStatus(event);
              }}
            >
              <FaTimes className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        );
      case "Inactive":
        return (
          <div className="flex space-x-2 mt-2">
            <button
              className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}
              aria-label="Edit course"
            >
              <FaEdit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              className={`${buttonClass} bg-green-500 hover:bg-green-600`}
              aria-label="Restore course"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleChangeStatus(event);
              }}
            >
              <FaUndo className="w-4 h-4 mr-1" />
              Restore
            </button>
          </div>
        );
      case "Processing":
        return (
          <div className="flex space-x-2 mt-2">
            <button
              className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}
              aria-label="Edit course"
            >
              <FaEdit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              className={`${buttonClass} bg-orange-500 hover:bg-orange-600`}
              aria-label="Cancel processing"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleChangeStatus(event);
              }}
            >
              <FaSync className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        );
      case "Unsent":
        return (
          <div className="flex space-x-2 mt-2">
            <button
              className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}
              aria-label="Send course"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleChangeStatus(event);
              }}
            >
              <FaPaperPlane className="w-4 h-4 mr-1" />
              Send
            </button>
            <button
              className={`${buttonClass} bg-red-500 hover:bg-red-600`}
              aria-label="Delete course"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleDeleteCourse(event);
              }}
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      case "Declined":
        return (
          <div className="flex space-x-2 mt-2">
            <button
              className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}
              aria-label="Send course"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleChangeStatus(event);
              }}
            >
              <FaPaperPlane className="w-4 h-4 mr-1" />
              Send
            </button>
            <button
              className={`${buttonClass} bg-red-500 hover:bg-red-600`}
              aria-label="Delete course"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleDeleteCourse(event);
              }}
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      to={`/instructor/courses/${courseId}`}
      className={`relative block border border-white-500 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl 
            ${
              courseStatus === "Active"
                ? "bg-green-100"
                : courseStatus === "Inactive"
                ? "bg-red-100"
                : courseStatus === "Processing"
                ? "bg-yellow-100"
                : courseStatus === "Unsent"
                ? "bg-orange-100"
                : courseStatus === "Declined"
                ? "bg-purple-100"
                : "bg-gray-100"
            }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={images[currentImageIndex] || "default-image.jpg"}
        alt={title || "Course image"}
        className="w-full h-40 object-cover rounded-t-lg"
      />

      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            {title || "Course Name"}
          </h2>
          {renderStatusIndicator()}
        </div>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {description || "Course description"}
        </p>

        <div className="flex items-center mt-3 space-x-1">
          <div className="flex">{renderStars()}</div>
          <span className="text-gray-600 text-sm ml-2">{rating || "N/A"}</span>
        </div>

        <div className="mt-3 flex items-center">
          <div className="text-lg font-semibold text-indigo-700">
            {price ? `${price} VND` : "Price not available"}
          </div>
        </div>
      </div>

      {showDetails && (
        <div
          className={`absolute inset-0 border border-gray-300 shadow-xl p-6 flex flex-col justify-between z-20 opacity-95 transition-opacity duration-300 ease-in-out rounded-lg 
                    ${
                      courseStatus === "Active"
                        ? "bg-green-200"
                        : courseStatus === "Inactive"
                        ? "bg-red-200"
                        : courseStatus === "Processing"
                        ? "bg-yellow-200"
                        : courseStatus === "Unsent"
                        ? "bg-orange-200"
                        : courseStatus === "Declined"
                        ? "bg-purple-200"
                        : "bg-gray-200"
                    }`}
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {title || "Course Name"}
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              {description || "Course description"}
            </p>
            <div className="flex items-center space-x-2 mb-3">
              <p className="text-gray-600 text-sm">Rating: {rating || "N/A"}</p>
              <FaStar color="#FFD700" className="text-xs" />
            </div>
            <p className="text-gray-600 text-lg font-semibold">
              Price: {price ? `${price} VND` : "Price not available"}
            </p>
          </div>
          {renderButtons()}
        </div>
      )}
    </Link>
  );
};

export default CourseCard;
