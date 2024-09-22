import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Camera } from "lucide-react";

// Dữ liệu mẫu với các trường thông tin chi tiết
const userData = [
	{
		id: 1,
		name: "John Doe",
		email: "john@example.com",
		role: "Customer",
		status: "Active",
		phoneNumber: "123-456-7890",
		address: "123 Main St, City, Country",
		bio: "Loves technology and enjoys learning new things.",
		dateOfBirth: "1990-05-12",
		profileImage: "https://randomuser.me/api/portraits/men/3.jpg" // Ảnh đại diện
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane@example.com",
		role: "Admin",
		status: "Active",
		phoneNumber: "234-567-8901",
		address: "456 Oak St, City, Country",
		bio: "Admin with a passion for user experience and security.",
		dateOfBirth: "1988-08-22",
		profileImage: "https://randomuser.me/api/portraits/women/13.jpg" // Ảnh đại diện
	},
	// Các người dùng khác...
];

// Số lượng người dùng hiển thị trên mỗi trang
const ITEMS_PER_PAGE = 5;

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);
	const [users, setUsers] = useState(userData);
	const [editingUser, setEditingUser] = useState(null); // Lưu user đang được chỉnh sửa
	const [currentPage, setCurrentPage] = useState(1); // Lưu trữ trang hiện tại

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
			(user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
		setCurrentPage(1); // Quay lại trang 1 khi tìm kiếm
	};

	// Xử lý chỉnh sửa người dùng
	const handleEdit = (user) => {
		setEditingUser(user); // Đặt người dùng đang chỉnh sửa
	};

	// Xử lý xóa người dùng
	const handleDelete = (userId) => {
		const confirmed = window.confirm("Are you sure you want to delete this user?");
		if (confirmed) {
			const updatedUsers = users.filter((user) => user.id !== userId);
			setUsers(updatedUsers);
			setFilteredUsers(updatedUsers);
		}
	};

	// Xử lý lưu thông tin sau khi chỉnh sửa
	const handleSave = () => {
		const updatedUsers = users.map((user) =>
			user.id === editingUser.id ? editingUser : user
		);
		setUsers(updatedUsers);
		setFilteredUsers(updatedUsers);
		setEditingUser(null); // Đóng form sau khi lưu
	};

	// Xử lý thay đổi dữ liệu trong form
	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditingUser({ ...editingUser, [name]: value });
	};

	// Xử lý chuyển trang
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// Xử lý thay đổi ảnh đại diện
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Đọc file và cập nhật ảnh đại diện
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditingUser({ ...editingUser, profileImage: reader.result });
			};
			reader.readAsDataURL(file);
		}
	};

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
							src={editingUser.profileImage} 
							alt={editingUser.name} 
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
						<label className='text-gray-400'>Name:</label>
						<input
							type='text'
							name='name'
							value={editingUser.name}
							onChange={handleChange}
							className='w-full p-2 bg-gray-600 text-white rounded-lg'
						/>
					</div>

					<div className='mb-4'>
						<label className='text-gray-400'>Email:</label>
						<input
							type='email'
							name='email'
							value={editingUser.email}
							onChange={handleChange}
							className='w-full p-2 bg-gray-600 text-white rounded-lg'
						/>
					</div>

					<div className='mb-4'>
						<label className='text-gray-400'>Phone Number:</label>
						<input
							type='text'
							name='phoneNumber'
							value={editingUser.phoneNumber}
							onChange={handleChange}
							className='w-full p-2 bg-gray-600 text-white rounded-lg'
						/>
					</div>

					<div className='mb-4'>
						<label className='text-gray-400'>Address:</label>
						<input
							type='text'
							name='address'
							value={editingUser.address}
							onChange={handleChange}
							className='w-full p-2 bg-gray-600 text-white rounded-lg'
						/>
					</div>

					<div className='mb-4'>
						<label className='text-gray-400'>Bio:</label>
						<textarea
							name='bio'
							value={editingUser.bio}
							onChange={handleChange}
							className='w-full p-2 bg-gray-600 text-white rounded-lg'
						/>
					</div>

					<div className='mb-4'>
						<label className='text-gray-400'>Date of Birth:</label>
						<input
							type='date'
							name='dateOfBirth'
							value={editingUser.dateOfBirth}
							onChange={handleChange}
							className='w-full p-2 bg-gray-600 text-white rounded-lg'
						/>
					</div>

					<div className='mb-4'>
						<label className='text-gray-400'>Role:</label>
						<select
							name='role'
							value={editingUser.role}
							onChange={handleChange}
							className='w-full p-2 bg-gray-600 text-white rounded-lg'
						>
							<option value='Customer'>Customer</option>
							<option value='Admin'>Admin</option>
							<option value='Moderator'>Moderator</option>
						</select>
					</div>

					<div className='mb-4'>
						<label className='text-gray-400'>Status:</label>
						<select
							name='status'
							value={editingUser.status}
							onChange={handleChange}
							className='w-full p-2 bg-gray-600 text-white rounded-lg'
						>
							<option value='Active'>Active</option>
							<option value='Inactive'>Inactive</option>
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
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Avatar
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Name
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
									Role
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
							{currentUsers.map((user) => (
								<motion.tr
									key={user.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									{/* Thêm ảnh đại diện */}
									<td className='px-6 py-4 whitespace-nowrap'>
										<img
											src={user.profileImage}
											alt={user.name}
											className='w-10 h-10 rounded-full object-cover'
										/>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm font-medium text-gray-100'>{user.name}</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>{user.email}</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>{user.phoneNumber}</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>{user.address}</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
											{user.role}
										</span>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												user.status === "Active"
													? "bg-green-800 text-green-100"
													: "bg-red-800 text-red-100"
											}`}
										>
											{user.status}
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
											className='text-red-400 hover:text-red-300'
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

export default UsersTable;
