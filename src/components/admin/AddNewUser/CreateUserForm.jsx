import { useState } from "react";
import { Camera } from "lucide-react"; // Import icon Camera

const CreateUserForm = () => {
  const [newUser, setNewUser] = useState({
    username: "", // Thêm trường username
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "", // Chỉ kiểm tra phía client
    role: "ROLE_STUDENT", // Mặc định là Student, có thể thay đổi qua select
    phoneNumber: "",
    address: "",
    bio: "",
    dateOfBirth: "",
    active: "true", // Mặc định trạng thái là Active
    profileImage: "", // Lưu ảnh đại diện
  });

  const [passwordError, setPasswordError] = useState(""); // Để lưu lỗi liên quan đến mật khẩu
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Xử lý khi người dùng tải lên ảnh đại diện
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser({ ...newUser, profileImage: file }); // Lưu file ảnh, không cần dùng base64
    }
  };

  // Hàm gọi API để tạo người dùng mới
  const onCreateUser = async (userData) => {
    setLoading(true); // Bắt đầu trạng thái loading
    const formData = new FormData();

    // Thêm các thông tin về user vào FormData
    formData.append("user", JSON.stringify(userData));

    // Nếu có file ảnh, thêm vào formData
    if (newUser.profileImage) {
      formData.append("profileImage", newUser.profileImage);
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/users?role=" + userData.role, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu có token
        },
        body: formData, // Dùng FormData cho multipart request
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage("User created successfully: " + data.firstName);
      } else {
        const errorData = await response.json();
        setResponseMessage("Error: " + errorData.message);
      }
    } catch (error) {
      setResponseMessage("Error: " + error.message);
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  // Xử lý khi nhấn "Create Account"
  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Tạo dữ liệu user nhưng không bao gồm `confirmPassword`
    const userData = {
      username: newUser.username, // Thêm username
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      address: newUser.address,
      bio: newUser.bio,
      dateOfBirth: newUser.dateOfBirth,
      active: newUser.active,
    };

    // Gọi API để tạo người dùng mới
    onCreateUser(userData);

    // Reset form sau khi tạo
    setNewUser({
      username: "", // Reset username
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ROLE_STUDENT", // Reset về mặc định
      phoneNumber: "",
      address: "",
      bio: "",
      dateOfBirth: "",
      active: "true", // Reset trạng thái Active
      profileImage: "", // Reset ảnh đại diện
    });
    setPasswordError(""); // Reset lỗi
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Create New User</h2>

      {/* Hiển thị ảnh đại diện đã chọn */}
      {newUser.profileImage ? (
        <div className="flex justify-center mb-4">
          <img
            src={URL.createObjectURL(newUser.profileImage)}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full"
          />
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center">
            <Camera size={48} className="text-gray-300" />
          </div>
        </div>
      )}

      {/* Nút tải lên ảnh */}
      <div className="flex justify-center mb-4">
        <label className="flex items-center cursor-pointer">
          <Camera className="text-gray-300 mr-2" />
          <span className="text-gray-300">Upload Profile Image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* Các trường thông tin khác */}
      <div className="mb-4">
        <label className="text-gray-400">Username:</label>
        <input
          type="text"
          name="username"
          value={newUser.username}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-400">First Name:</label>
        <input
          type="text"
          name="firstName"
          value={newUser.firstName}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={newUser.lastName}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Email:</label>
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Password:</label>
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={newUser.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
        {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={newUser.phoneNumber}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Address:</label>
        <input
          type="text"
          name="address"
          value={newUser.address}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Bio:</label>
        <textarea
          name="bio"
          value={newUser.bio}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Date of Birth:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={newUser.dateOfBirth}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-400">Role:</label>
        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
          className="w-full p-2 bg-gray-600 text-white rounded-lg"
        >
          <option value="ROLE_STUDENT">Student</option>
          <option value="ROLE_INSTRUCTOR">Instructor</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleCreateUser}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>

      {/* Hiển thị thông báo phản hồi */}
      {responseMessage && <p className="mt-4 text-white">{responseMessage}</p>}
    </div>
  );
};

export default CreateUserForm;
