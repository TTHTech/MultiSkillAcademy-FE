import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Camera } from "lucide-react";

// Hằng số số lượng item trên mỗi trang
const ITEMS_PER_PAGE = 5;

// Hàm tạo màu ngẫu nhiên cho avatar
const getRandomColor = () => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const InstructorsTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredInstructors, setFilteredInstructors] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [editingInstructor, setEditingInstructor] = useState(null); // Lưu instructor đang được chỉnh sửa
    const [currentPage, setCurrentPage] = useState(1); // Lưu trữ trang hiện tại
    const [loading, setLoading] = useState(true); // Trạng thái đang tải
    const [error, setError] = useState(null); // Trạng thái lỗi

    // Gọi API để lấy danh sách giảng viên
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem("token");

                // Kiểm tra xem có token hay không
                if (!token) {
                    throw new Error("No token found, please login first.");
                }

                const response = await fetch("http://localhost:8080/api/admin/instructors", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Sử dụng token từ localStorage
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch instructors");
                }
                const data = await response.json();
                setInstructors(data);
                setFilteredInstructors(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    // Tính toán số trang
    const totalPages = Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE);

    // Lấy giảng viên trên trang hiện tại
    const currentInstructors = filteredInstructors.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = instructors.filter(
            (instructor) =>
                `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(term) ||
                instructor.email.toLowerCase().includes(term)
        );
        setFilteredInstructors(filtered);
        setCurrentPage(1); // Quay lại trang 1 khi tìm kiếm
    };

    // Xử lý chỉnh sửa giảng viên
    const handleEdit = (instructor) => {
        setEditingInstructor(instructor); // Đặt giảng viên đang chỉnh sửa
    };

    // Xử lý xóa giảng viên
    const handleDelete = async (instructorId) => {
        const confirmed = window.confirm("Are you sure you want to delete this instructor?");
        if (confirmed) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/api/admin/instructors/${instructorId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to delete instructor');
                }
                const updatedInstructors = instructors.filter((instructor) => instructor.id !== instructorId);
                setInstructors(updatedInstructors);
                setFilteredInstructors(updatedInstructors);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Xử lý lưu thông tin sau khi chỉnh sửa
    const handleSave = async () => {
        const formData = new FormData();

        // Thêm thông tin giảng viên dưới dạng chuỗi JSON
        const instructorData = {
            firstName: editingInstructor.firstName,
            lastName: editingInstructor.lastName,
            email: editingInstructor.email,
            phoneNumber: editingInstructor.phoneNumber,
            address: editingInstructor.address,
            bio: editingInstructor.bio,
            dateOfBirth: editingInstructor.dateOfBirth,
            role: editingInstructor.role,
            active: editingInstructor.active,
        };

        formData.append('instructor', JSON.stringify(instructorData)); // Chuyển đối tượng thành JSON string

        // Thêm ảnh đại diện nếu có ảnh mới
        if (editingInstructor.profileImageFile) {
            formData.append('profileImage', editingInstructor.profileImageFile);
            console.log('File được thêm vào FormData:', editingInstructor.profileImageFile);
        } else {
            console.log('Không có file ảnh nào được chọn');
        }

        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const response = await fetch(`http://localhost:8080/api/admin/instructors/${editingInstructor.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`, // Không cần đặt Content-Type vì FormData tự xử lý
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update instructor');
            }

            const updatedInstructor = await response.json();
            console.log("Updated instructor data:", updatedInstructor);

            // Cập nhật danh sách giảng viên
            const updatedInstructors = instructors.map((instructor) =>
                instructor.id === editingInstructor.id ? updatedInstructor : instructor
            );
            setInstructors(updatedInstructors);
            setFilteredInstructors(updatedInstructors);
            setEditingInstructor(null); // Đóng form sau khi lưu
        } catch (error) {
            console.error("Error updating instructor:", error);
        }
    };

    // Xử lý thay đổi dữ liệu trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = name === "active" ? (value === "true") : value;
        setEditingInstructor({ ...editingInstructor, [name]: formattedValue });
    };

    // Xử lý thay đổi ảnh đại diện
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) { // Kiểm tra file là ảnh
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingInstructor({
                    ...editingInstructor,
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
                <h2 className='text-xl font-semibold text-gray-100'>Instructors</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search instructors...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            {editingInstructor ? (
                // Form chỉnh sửa instructor
                <div className='bg-gray-700 p-4 rounded-lg'>
                    <h3 className='text-lg font-semibold text-gray-100 mb-4'>Edit Instructor Details</h3>

                    {/* Ảnh đại diện */}
                    <div className="flex justify-center mb-4">
                        <img
                            src={editingInstructor.profileImage || "https://th.bing.com/th/id/OIP.xqYunaXLEIiIBgbHGncjBQHaHa?rs=1&pid=ImgDetMain"}
                            alt={editingInstructor.firstName}
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
                        <label className='text-gray-400'>First Name:</label>
                        <input
                            type='text'
                            name='firstName'
                            value={editingInstructor.firstName}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-gray-400'>Last Name:</label>
                        <input
                            type='text'
                            name='lastName'
                            value={editingInstructor.lastName}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-gray-400'>Email:</label>
                        <input
                            type='email'
                            name='email'
                            value={editingInstructor.email}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-gray-400'>Phone Number:</label>
                        <input
                            type='text'
                            name='phoneNumber'
                            value={editingInstructor.phoneNumber}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-gray-400'>Address:</label>
                        <input
                            type='text'
                            name='address'
                            value={editingInstructor.address}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-gray-400'>Bio:</label>
                        <textarea
                            name='bio'
                            value={editingInstructor.bio}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-gray-400'>Date of Birth:</label>
                        <input
                            type='date'
                            name='dateOfBirth'
                            value={editingInstructor.dateOfBirth ? new Date(editingInstructor.dateOfBirth).toISOString().split('T')[0] : ""}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='text-gray-400'>Role:</label>
                        <select
                            name='role'
                            value={editingInstructor.role}
                            onChange={handleChange}
                            className='w-full p-2 bg-gray-600 text-white rounded-lg'
                        >
                            <option value='Instructor'>Instructor</option>
                            <option value='Admin'>Admin</option>
                        </select>
                    </div>

                    <div className='mb-4'>
                        <label className='text-gray-400'>Status:</label>
                        <select
                            name='active' // Sử dụng trường active
                            value={editingInstructor.active ? "true" : "false"} // Sử dụng giá trị active
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
                            onClick={() => setEditingInstructor(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // Bảng hiển thị danh sách instructor
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Avatar
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    First Name
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Last Name
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Phone
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Address
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-700'>
                            {currentInstructors.map((instructor) => (
                                <motion.tr
                                    key={instructor.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Avatar logic: Hiển thị ảnh đại diện nếu có, nếu không thì hiển thị ảnh với chữ cái đầu */}
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        {instructor.profileImage ? (
                                            <img
                                                src={instructor.profileImage || "https://th.bing.com/th/id/OIP.U0D5JdoPkQMi4jhiriSVsgHaHa?rs=1&pid=ImgDetMain"}
                                                alt={instructor.firstName}
                                                className='w-10 h-10 rounded-full object-cover'
                                            />
                                        ) : (
                                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getRandomColor()} text-white text-lg font-semibold`}>
                                                {instructor.lastName ? instructor.lastName.charAt(0).toUpperCase() : "?"}
                                            </div>
                                        )}
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-gray-100'>{instructor.firstName}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-gray-100'>{instructor.lastName}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-300'>{instructor.email}</div>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-300'>{instructor.phoneNumber}</div>
                                    </td>

                                    <td className='px-6 py-4'>
                                        <div className='text-sm text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]'>
                                            {instructor.address}
                                        </div>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                instructor.active === true || instructor.active === 1
                                                    ? "bg-green-800 text-green-100"
                                                    : "bg-red-800 text-red-100"
                                            }`}
                                        >
                                            {instructor.active === true || instructor.active === 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <button
                                            className='text-indigo-400 hover:text-indigo-300 mr-2'
                                            onClick={() => handleEdit(instructor)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className='text-red-400 hover:text-red-300'
                                            onClick={() => handleDelete(instructor.id)}
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
                                    currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
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

export default InstructorsTable;
