import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import ChangePassword from "./ChangePassword";
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
const ProfileEdit = () => {
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));
  const [instructor, setInstructor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    dateOfBirth: "",
    profileImage: "",
    websiteUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [courseData, setCourseData] = useState({});
  const [salesData, setSalesData] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [studentData, setStudentData] = useState({});
  useEffect(() => {
    const fetchAllData = async () => {
      const tokenLocal = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
        },
      };

      try {
        const [courseResponse, salesResponse, reviewResponse, studentResponse] =
          await Promise.all([
            axios.get(
              `http://localhost:8080/api/instructor/dashboard/courses/${userId}`,
              config
            ),
            axios.get(
              `http://localhost:8080/api/instructor/dashboard/sales/${userId}`,
              config
            ),
            axios.get(
              `http://localhost:8080/api/instructor/dashboard/reviews/${userId}`,
              config
            ),
            axios.get(
              `http://localhost:8080/api/instructor/dashboard/students/${userId}`,
              config
            ),
          ]);

        setCourseData(courseResponse.data);
        setSalesData(salesResponse.data);
        setReviewData(reviewResponse.data);
        setStudentData(studentResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }

      try {
        // Gọi API lấy thông tin giảng viên
        const instructorResponse = await axios.get(
          `http://localhost:8080/api/instructor/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${tokenLocal}`,
            },
          }
        );
        setInstructor(instructorResponse.data);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchAllData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructor((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setHasChanges(true);
    }
  };
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        "http://localhost:8080/api/cloudinary/upload/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleSave = async () => {
    const confirmResult = await Swal.fire({
      title: "Xác nhận lưu thông tin",
      text: "Bạn có chắc chắn muốn lưu thông tin không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }
    setIsLoading(true);
    let imageUrl = instructor.profileImage;
    if (selectedFile) {
      imageUrl = await handleUpload(selectedFile);
    }
    const updatedData = {
      id: userId,
      profileImage: imageUrl,
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      email: instructor.email,
      phoneNumber: instructor.phoneNumber,
      address: instructor.address,
      bio: instructor.bio,
      dateOfBirth: instructor.dateOfBirth,
      websiteUrl: instructor.websiteUrl,
      facebookUrl: instructor.facebookUrl,
      tiktokUrl: instructor.tiktokUrl,
      youtubeUrl: instructor.youtubeUrl,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/instructor/edit-user/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cập nhật thành công:", response.data);
      await Swal.fire({
        title: "Confirmation",
        text: "Cập nhật thông tin thành công!",
        icon: "success",
        confirmButtonText: "Yes",
      });
      setHasChanges(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi cập nhật thông tin giảng viên:", error);
      await Swal.fire({
        title: "error",
        text: "Cập nhật thông tin không thành công!",
        icon: "error",
        confirmButtonText: "Yes",
      });
      setIsLoading(false);
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
    <div className="w-full p-4 mx-4 bg-white shadow-md rounded-md mt-5">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        Instructor Profile Details
        {instructor.active ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-semibold">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Inactive
          </span>
        )}
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center gap-4">
          <div>
            {instructor.profileImage && !selectedFile ? (
              <img
                src={instructor.profileImage}
                alt="Profile"
                className="w-64 h-64 object-cover rounded-md border border-gray-300 shadow-lg"
              />
            ) : selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="w-64 h-64 object-cover rounded-md border border-gray-300 shadow-lg"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-md border border-dashed border-gray-400">
                <span className="text-gray-500">Chưa có ảnh</span>
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-nowrap items-center gap-4 mt-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition px-4 py-2 rounded-md flex-shrink-0"
              >
                Chọn hình ảnh
              </label>
              <button
                className="inline-flex items-center gap-2 border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 transition px-4 py-2 rounded-md flex-shrink-0"
                onClick={() => setShowChangePassword(true)}
              >
                Đổi mật khẩu
              </button>
              {showChangePassword && (
                <ChangePassword onClose={() => setShowChangePassword(false)} />
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Courses */}
            <div>
              <p className="text-gray-600 font-bold">Courses</p>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
                <AcademicCapIcon className="w-8 h-8 text-blue-800 mb-2" />
                <h3 className="text-xl font-bold text-gray-800">
                  {courseData.totalCourses}
                </h3>
              </div>
            </div>

            {/* Sales */}
            <div>
              <p className="text-gray-600 font-bold">Sales (VND)</p>
              <div className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
                <CurrencyDollarIcon className="w-8 h-8 text-green-800 mb-2" />
                <h3 className="text-xl font-bold text-gray-800">
                  {salesData?.totalSales
                    ? salesData.totalSales.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      })
                    : "0 VND"}
                </h3>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <p className="text-gray-600 font-bold">Reviews</p>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
                <StarIcon className="w-8 h-8 text-purple-800 mb-2" />
                <h3 className="text-xl font-bold text-gray-800">
                  {reviewData.totalReview}
                </h3>
              </div>
            </div>

            {/* Students */}
            <div>
              <p className="text-gray-600 font-bold">Students</p>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg rounded-lg p-4 flex flex-col items-center">
                <UserGroupIcon className="w-8 h-8 text-yellow-800 mb-2" />
                <h3 className="text-xl font-bold text-gray-800">
                  {studentData.totalStudent}
                </h3>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Trang web
              </label>
              <input
                name="websiteUrl"
                type="text"
                className="border border-gray-300 p-2 w-full rounded"
                value={instructor.websiteUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Facebook
              </label>
              <input
                name="facebookUrl"
                type="text"
                className="border border-gray-300 p-2 w-full rounded"
                value={instructor.facebookUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                TikTok
              </label>
              <input
                name="tiktokUrl"
                type="text"
                className="border border-gray-300 p-2 w-full rounded"
                value={instructor.tiktokUrl || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                YouTube
              </label>
              <input
                name="youtubeUrl"
                type="text"
                className="border border-gray-300 p-2 w-full rounded"
                value={instructor.youtubeUrl || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      {hasChanges && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition px-8 py-2 rounded-md"
          >
            Lưu
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-gray-600 font-semibold mb-1">Họ</label>
          <input
            name="firstName"
            type="text"
            value={instructor.firstName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold mb-1">Tên</label>
          <input
            name="lastName"
            type="text"
            value={instructor.lastName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Email
          </label>
          <input
            name="email"
            type="text"
            value={instructor.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Số điện thoại
          </label>
          <input
            name="phoneNumber"
            type="number"
            value={instructor.phoneNumber}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Địa chỉ
          </label>
          <input
            name="address"
            type="text"
            value={instructor.address}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Ngày sinh
          </label>
          <input
            name="dateOfBirth"
            type="date"
            value={instructor.dateOfBirth}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-gray-600 font-semibold mb-1">
          Giới thiệu
        </label>
        <textarea
          name="bio"
          rows="3"
          value={instructor.bio}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        ></textarea>
      </div>
    </div>
  );
};

export default ProfileEdit;
