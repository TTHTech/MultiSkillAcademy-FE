import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

const InstructorProfile = () => {
  const [instructor, setInstructor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = Number(localStorage.getItem("userId"));

  const updateUrl = `http://localhost:8080/api/instructor/edit-user/${userId}`;

  // Lấy dữ liệu giảng viên từ API
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, please login first.");

        const response = await fetch(
          `http://localhost:8080/api/instructor/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch instructor data");

        const data = await response.json();
        setInstructor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [userId]);

  // Cập nhật thông tin
  const handleSave = async () => {
    const formData = new FormData();

    // Thêm dữ liệu giảng viên vào FormData
    const instructorData = {
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      email: instructor.email,
      phoneNumber: instructor.phoneNumber,
      address: instructor.address,
      bio: instructor.bio,
      dateOfBirth: instructor.dateOfBirth,
      role: instructor.role,
      active: instructor.active,
    };

    formData.append("instructor", JSON.stringify(instructorData));

    // Thêm ảnh đại diện nếu có
    if (instructor.profileImageFile) {
      formData.append("profileImage", instructor.profileImageFile);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update instructor");

      const updatedInstructor = await response.json();
      setInstructor(updatedInstructor);
      setIsEditing(false); // Đóng chế độ chỉnh sửa
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructor({ ...instructor, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInstructor({
          ...instructor,
          profileImage: reader.result,
          profileImageFile: file, // Lưu lại file ảnh để gửi trong yêu cầu PUT
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-lg p-6">
      {isEditing ? (
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Edit Profile
          </h2>

          {/* Avatar Section */}
          <div className="flex justify-center mb-6">
            <img
              src={instructor.profileImage || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-300"
            />
          </div>

          {/* Change Avatar Button */}
          <label className="flex items-center justify-center cursor-pointer mb-6 text-gray-700 hover:text-gray-900">
            <Camera className="mr-2 text-xl" />
            <span>Change Profile Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {/* Form Inputs */}
          <div className="space-y-4">
            <input
              type="text"
              name="firstName"
              value={instructor.firstName || ""}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="lastName"
              value={instructor.lastName || ""}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={instructor.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="phoneNumber"
              value={instructor.phoneNumber || ""}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="address"
              value={instructor.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="bio"
              value={instructor.bio || ""}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full p-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="dateOfBirth"
              value={
                instructor.dateOfBirth
                  ? new Date(instructor.dateOfBirth).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-full p-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save and Cancel Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Profile Details
          </h2>
          <div className="flex flex-col items-center">
            <img
              src={instructor.profileImage || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 mb-4"
            />
            <div className="w-full">
              <p className="text-gray-700 font-medium mb-2">
                <span className="font-semibold">Name:</span>{" "}
                {`${instructor.firstName} ${instructor.lastName}`}
              </p>
              <p className="text-gray-700 font-medium mb-2">
                <span className="font-semibold">Email:</span> {instructor.email}
              </p>
              <p className="text-gray-700 font-medium mb-2">
                <span className="font-semibold">Phone:</span>{" "}
                {instructor.phoneNumber}
              </p>
              <p className="text-gray-700 font-medium mb-2">
                <span className="font-semibold">Address:</span>{" "}
                {instructor.address}
              </p>
              <p className="text-gray-700 font-medium mb-2">
                <span className="font-semibold">Bio:</span> {instructor.bio}
              </p>
              <p className="text-gray-700 font-medium mb-2">
                <span className="font-semibold">Date of Birth:</span>{" "}
                {instructor.dateOfBirth
                  ? new Date(instructor.dateOfBirth).toLocaleDateString("en-GB")
                  : ""}
              </p>
              <p className="text-gray-700 font-medium mb-2">
                <span className="font-semibold">Status:</span>{" "}
                {instructor.active ? "Active" : "Inactive"}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorProfile;
