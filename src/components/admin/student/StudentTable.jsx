import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Camera } from "lucide-react";

const ITEMS_PER_PAGE = 5;

// Hàm tạo màu ngẫu nhiên cho avatar
const getRandomColor = () => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const UsersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null); // Lưu user đang được chỉnh sửa
    const [currentPage, setCurrentPage] = useState(1); // Lưu trữ trang hiện tại
    const [loading, setLoading] = useState(true); // Trạng thái đang tải
    const [error, setError] = useState(null); // Trạng thái lỗi

    // Gọi API để lấy danh sách người dùng
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem("token");

                // Kiểm tra xem token có tồn tại không
                if (!token) {
                    throw new Error("No token found, please login first.");
                }

                const response = await fetch("https://educoresystem-1.onrender.com/api/admin/students", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Sử dụng token từ localStorage
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Tính toán số trang
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    // Lấy người dùng trên trang hiện tại
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter(
            (user) =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
        setCurrentPage(1); // Quay lại trang 1 khi tìm kiếm
    };

    // Xử lý chỉnh sửa người dùng
    const handleEdit = (user) => {
        setEditingUser(user); // Đặt người dùng đang chỉnh sửa
    };

    // Xử lý xóa người dùng
    const handleDelete = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            try {
                const token = localStorage.getItem("token"); // Lấy token từ localStorage
                const response = await fetch(`https://educoresystem-1.onrender.com/api/admin/students/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Sử dụng token từ localStorage
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                const updatedUsers = users.filter((user) => user.id !== userId);
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Xử lý lưu thông tin sau khi chỉnh sửa
    const handleSave = async () => {
        const formData = new FormData();
        
        // Thêm thông tin sinh viên dưới dạng chuỗi JSON
        const studentData = {
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            email: editingUser.email,
            phoneNumber: editingUser.phoneNumber,
            address: editingUser.address,
            bio: editingUser.bio,
            dateOfBirth: editingUser.dateOfBirth,
            role: editingUser.role,
            active: editingUser.active,
        };
        
        formData.append('student', JSON.stringify(studentData)); // Chuyển đối tượng thành JSON string
    
        // Thêm ảnh đại diện nếu có ảnh mới
        if (editingUser.profileImageFile) {
            formData.append('profileImage', editingUser.profileImageFile);
        }
    
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const response = await fetch(`https://educoresystem-1.onrender.com/api/admin/students/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`, // Không cần đặt Content-Type vì FormData tự xử lý
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
    
            const updatedUser = await response.json();
            // Cập nhật danh sách người dùng
            const updatedUsers = users.map((user) =>
                user.id === editingUser.id ? updatedUser : user
            );
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            setEditingUser(null); // Đóng form sau khi lưu
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    // Xử lý thay đổi dữ liệu trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = name === "active" ? (value === "true") : value;
        setEditingUser({ ...editingUser, [name]: formattedValue });
    };

    // Xử lý thay đổi ảnh đại diện
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) { // Kiểm tra file là ảnh
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingUser({ 
                    ...editingUser, 
                    profileImageFile: file, 
                    profileImage: reader.result 
                });
            };
            reader.readAsDataURL(file);
        } else {
            console.log("File được chọn không phải là ảnh.");
        }
    };

    // Xử lý chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Hiển thị trạng thái đang tải
    if (loading) {
        return <div>Loading...</div>;
    }

    // Hiển thị thông báo lỗi nếu có
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Users</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search users...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            {editingUser ? (
                // Form chỉnh sửa user
                <div className='bg-gray-700 p-4 rounded-lg'>
                    <h3 className='text-lg font-semibold text-gray-100 mb-4'>Edit User Details</h3>

                    {/* Ảnh đại diện */}
                    <div className="flex justify-center mb-4">
                        <img
                            src={editingUser.profileImage || "https://th.bing.com/th/id/OIP.xqYunaXLEIiIBgbHGncjBQHaHa?rs=1&pid=ImgDetMain"}
                            alt={editingUser.firstName}
                            className="w-32 h-32 object-cover rounded-full"
                        />
                    </div>

                    {/* Nút thay đổi ảnh đại diện */}
                    <div className="flex justify-center mb-4">
                        <label className="flex items-center cursor-pointer">
                            <Camera className="text-gray-300 mr-2" />
                            <span className="text-gray-300">Change Profile Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {/* Hiển thị tất cả các thông tin chi tiết */}
                    <div className='mb-4'>
                        <label className='text-white'>First Name:</label>
                        <input
                            type='text'
                            name='firstName'
                            value={editingUser.firstName}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-white'>Last Name:</label>
                        <input
                            type='text'
                            name='lastName'
                            value={editingUser.lastName}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-white'>Email:</label>
                        <input
                            type='email'
                            name='email'
                            value={editingUser.email}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-white'>Phone Number:</label>
                        <input
                            type='text'
                            name='phoneNumber'
                            value={editingUser.phoneNumber}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-white'>Address:</label>
                        <input
                            type='text'
                            name='address'
                            value={editingUser.address}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-white'>Bio:</label>
                        <textarea
                            name='bio'
                            value={editingUser.bio}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-white'>Date of Birth:</label>
                        <input
                            type='date'
                            name='dateOfBirth'
                            value={editingUser.dateOfBirth ? new Date(editingUser.dateOfBirth).toISOString().split('T')[0] : ""}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                            />
                    </div>

                    <div className='mb-4'>
                        <label className='text-white'>Role:</label>
                        <select
                            name='role'
                            value={editingUser.role}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        >
                            <option value='Student'>Student</option>
                            <option value='Instructor'>Instructor</option>
                        </select>
                    </div>

                    <div className='mb-4'>
                        <label className='text-white'>Status:</label>
                        <select
                            name='active' // Sử dụng trường active
                            value={editingUser.active ? "true" : "false"} // Sử dụng giá trị active
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        >
                            <option value='true'>Active</option>
                            <option value='false'>Inactive</option>
                        </select>
                    </div>

                    <div className='flex justify-end'>
                        <button
                            className='bg-blue-500 text-white px-4 py-2 rounded-lg mr-2'
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className='bg-gray-500 text-white px-4 py-2 rounded-lg'
                            onClick={() => setEditingUser(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // Bảng hiển thị danh sách user
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                                    Avatar
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider'>
                                    First Name
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider'>
                                    Last Name
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider'>
                                    Phone
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider'>
                                    Address
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-white  uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-700'>
                            {currentUsers.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Avatar logic: Hiển thị ảnh đại diện nếu có, nếu không thì hiển thị ảnh với chữ cái đầu */}
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                      
                                        {user.profileImage ? (
                                            <img
                                                src={user.profileImage || "https://th.bing.com/th/id/OIP.U0D5JdoPkQMi4jhiriSVsgHaHa?rs=1&pid=ImgDetMain"}
                                                alt={user.firstName}
                                                className='w-10 h-10 rounded-full object-cover'
                                            />
                                        ) : (
                                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getRandomColor()} text-white text-lg font-semibold`}>
                                                {user.lastName ? user.lastName.charAt(0).toUpperCase() : "?"}
                                            </div>
                                        )}
                                    </td>


                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-white'>{user.firstName}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-white'>{user.lastName}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-white'>{user.email}</div>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-white'>{user.phoneNumber}</div>
                                    </td>

                                    <td className='px-6 py-4'>
                                        <div className='text-sm text-white overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]'>
                                            {user.address}
                                        </div>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.active === true || user.active === 1
                                                    ? "bg-yellow-500 text-black"
                                                    : "bg-red-500 text-white"
                                            }`}
                                        >
                                            {user.active === true || user.active === 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <button
                                            className='text-indigo-400 hover:text-indigo-300 mr-2'
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className='text-red-500 hover:text-red-300'
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Phân trang */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 mx-1 rounded-lg ${
                                    currentPage === index + 1 ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default UsersTable;
