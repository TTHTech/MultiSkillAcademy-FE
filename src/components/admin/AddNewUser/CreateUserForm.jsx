import { useState } from "react";
import { Camera } from "lucide-react"; // Import icon Camera

const CreateUserForm = ({ onCreateUser }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
    phoneNumber: "",
    address: "",
    bio: "",
    dateOfBirth: "",
    status: "Active",
    profileImage: "", // Lưu ảnh đại diện
  });

  const [passwordError, setPasswordError] = useState(""); // Để lưu lỗi liên quan đến mật khẩu

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser({ ...newUser, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi nhấn "Create Account"
  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Nếu không có lỗi, gọi hàm onCreateUser để xử lý
    onCreateUser(newUser);

    // Reset form sau khi tạo
    setNewUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Customer",
      phoneNumber: "",
      address: "",
      bio: "",
      dateOfBirth: "",
      status: "Active",
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
            src={newUser.profileImage}
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

      <div className="mb-4">
        <label className="text-gray-400">Name:</label>
        <input
          type="text"
          name="name"
          value={newUser.name}
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
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleCreateUser}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default CreateUserForm;
