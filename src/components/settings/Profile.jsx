import { useState } from "react";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false); // State để điều khiển form chỉnh sửa
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com", // Email không cho chỉnh sửa
    bio: "Loves technology and enjoys learning new things.",
    phoneNumber: "123-456-7890",
    address: "123 Main St, City, Country",
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Chuyển đổi chế độ xem hoặc chỉnh sửa
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Lưu thông tin mới (có thể thêm logic lưu trữ vào backend)
    setIsEditing(false);
  };

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className='flex flex-col sm:flex-row items-center mb-6'>
        <img
          src='https://randomuser.me/api/portraits/men/3.jpg'
          alt='Profile'
          className='rounded-full w-20 h-20 object-cover mr-4'
        />
        <div>
          <h3 className='text-lg font-semibold text-gray-100'>{userProfile.name}</h3>
          <p className='text-gray-400'>{userProfile.email}</p>
        </div>
      </div>

      {/* Nếu đang chỉnh sửa, hiển thị form chỉnh sửa */}
      {isEditing ? (
        <div>
          <div className="mb-4">
            <label className="text-gray-400">Name:</label>
            <input
              type="text"
              name="name"
              value={userProfile.name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-600 text-white rounded-lg"
            />
          </div>

          {/* Email chỉ hiển thị, không cho phép chỉnh sửa */}
          <div className="mb-4">
            <label className="text-gray-400">Email:</label>
            <input
              type="email"
              name="email"
              value={userProfile.email}
              className="w-full p-2 bg-gray-600 text-white rounded-lg"
              readOnly
            />
            <p className="text-sm text-gray-500">Email cannot be changed.</p>
          </div>

          <div className="mb-4">
            <label className="text-gray-400">Bio:</label>
            <textarea
              name="bio"
              value={userProfile.bio}
              onChange={handleChange}
              className="w-full p-2 bg-gray-600 text-white rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={userProfile.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 bg-gray-600 text-white rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400">Address:</label>
            <input
              type="text"
              name="address"
              value={userProfile.address}
              onChange={handleChange}
              className="w-full p-2 bg-gray-600 text-white rounded-lg"
            />
          </div>

          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={handleEditClick}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // Nếu không trong chế độ chỉnh sửa, hiển thị thông tin cơ bản
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          onClick={handleEditClick}
        >
          Edit Profile
        </button>
      )}
    </SettingSection>
  );
};

export default Profile;
