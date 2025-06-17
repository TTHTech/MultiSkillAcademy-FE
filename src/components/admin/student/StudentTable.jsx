import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Camera, Edit, Trash2, ChevronLeft, ChevronRight, Loader, AlertTriangle, X } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ITEMS_PER_PAGE = 5;

// Animation styles
const animationStyles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.98);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.4s ease-out;
}

.hover\\:scale-101:hover {
  transform: scale(1.01);
}
`;

// Function to generate a random color for avatar
const getAvatarColor = (name) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  
  // Use name to generate consistent color for the same user
  const charCodeSum = name?.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) || 0;
  return colors[charCodeSum % colors.length];
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ user, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
    <motion.div 
      className="bg-slate-800 p-6 rounded-md w-full max-w-md border border-slate-700/50 shadow-xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-red-500 rounded-r mr-3"></div>
          <h3 className="text-lg font-semibold text-white">Xác nhận xóa</h3>
        </div>
        <button 
          onClick={onCancel}
          className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="mb-6">
        <AlertTriangle className="text-yellow-400 mx-auto mb-3" size={32} />
        <p className="text-slate-300 text-center">
          Bạn có chắc chắn muốn xóa học viên <span className="font-semibold text-white">{user.firstName} {user.lastName}</span> không?
        </p>
        <p className="mt-2 text-slate-400 text-sm text-center">Hành động này không thể hoàn tác.</p>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm"
        >
          Xóa học viên
        </button>
      </div>
    </motion.div>
  </div>
);

// PageButton Component
const PageButton = ({ page, currentPage, onClick }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 mx-1 rounded-md flex items-center justify-center transition-all text-sm ${
      currentPage === page 
        ? "bg-blue-600 text-white shadow-md" 
        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
    }`}
  >
    {page}
  </button>
);

const UsersTable = () => {
  // Inject animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token, vui lòng đăng nhập lại.");
        }

        const response = await fetch(
          `${baseUrl}/api/admin/students`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách học viên");
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

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // Get users for current page
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser({...user});
  };

  // Open delete confirmation dialog
  const initiateDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/students/${userToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa học viên");
      }

      // Update user list after deletion
      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      // Close modal
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle save after editing
  const handleSave = async () => {
    const formData = new FormData();

    // Add student data as JSON string
    const studentData = {
      firstName: editingUser.firstName,
      lastName: editingUser.lastName,
      email: editingUser.email,
      phoneNumber: editingUser.phoneNumber,
      address: editingUser.address,
      bio: editingUser.bio,
      dateOfBirth: editingUser.dateOfBirth,
      role: "Student", // Luôn giữ role là Student
      active: editingUser.active,
    };

    formData.append("student", JSON.stringify(studentData));

    // Add profile image if there's a new one
    if (editingUser.profileImageFile) {
      formData.append("profileImage", editingUser.profileImageFile);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/students/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật học viên");
      }

      const updatedUser = await response.json();
      // Update user list
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditingUser(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật học viên:", error);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "active" ? value === "true" : value;
    setEditingUser({ ...editingUser, [name]: formattedValue });
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingUser({
          ...editingUser,
          profileImageFile: file,
          profileImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin text-blue-400 mb-4" size={28} />
          <p className="text-slate-300 text-sm">Đang tải dữ liệu học viên...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-900/10 border border-red-900/30 text-red-300 rounded-md p-4 flex items-center">
        <AlertTriangle className="text-red-400 mr-3" size={20} />
        <div>
          <h3 className="font-medium text-base mb-1">Lỗi</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-md p-6 border border-slate-700/40 mb-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Delete confirmation modal */}
      {showDeleteConfirm && userToDelete && (
        <DeleteConfirmationModal
          user={userToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Header with title and search - chỉ hiển thị khi không ở chế độ edit */}
      {!editingUser && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1.5 h-8 bg-blue-500 rounded-r mr-3" />
            <h2 className="text-xl font-semibold text-white tracking-tight">Quản lý học viên</h2>
          </div>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Tìm kiếm học viên..."
              className="w-full bg-slate-800/80 text-slate-200 placeholder-slate-400 rounded-md pl-9 pr-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
        </div>
      )}

      {editingUser ? (
        // Edit user form
        <div className="bg-slate-800/40 rounded-md p-5 backdrop-blur-sm border border-slate-700/30 animate-fadeIn">
          <div className="flex items-center mb-5">
            <div className="w-1.5 h-8 bg-blue-500 rounded-r mr-3" />
            <h3 className="text-lg font-semibold text-white">Chỉnh sửa thông tin học viên</h3>
          </div>

          {/* Profile image */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={
                  editingUser.profileImage ||
                  "https://th.bing.com/th/id/OIP.xqYunaXLEIiIBgbHGncjBQHaHa?rs=1&pid=ImgDetMain"
                }
                alt={editingUser.firstName}
                className="w-28 h-28 object-cover rounded-full border-4 border-slate-700"
              />
              <label className="absolute -bottom-2 -right-2 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md transition-colors">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Form fields in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Tên</label>
              <input
                type="text"
                name="firstName"
                value={editingUser.firstName || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Họ</label>
              <input
                type="text"
                name="lastName"
                value={editingUser.lastName || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={editingUser.email || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={editingUser.phoneNumber || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={
                  editingUser.dateOfBirth
                    ? new Date(editingUser.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Vai trò</label>
              <select
                name="role"
                value="Student"
                disabled
                className="w-full p-2.5 bg-slate-700/30 text-slate-400 rounded-md border border-slate-600/50 cursor-not-allowed"
              >
                <option value="Student">Học viên</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Trạng thái</label>
              <select
                name="active"
                value={editingUser.active ? "true" : "false"}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={editingUser.address || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Giới thiệu</label>
              <textarea
                name="bio"
                value={editingUser.bio || ''}
                onChange={handleChange}
                rows="4"
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700/30">
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm transform hover:scale-101 flex items-center justify-center gap-2"
              onClick={handleSave}
            >
              <Edit size={16} />
              <span>Lưu thay đổi</span>
            </button>
            <button
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm transform hover:scale-101"
              onClick={() => setEditingUser(null)}
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        // Users table
        <>
          <div className="overflow-x-auto rounded-md border border-slate-700/40">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800/90 to-slate-800/70 border-b border-slate-700/40">
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Ảnh đại diện</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Họ tên</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Điện thoại</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Địa chỉ</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className="bg-slate-800/20 hover:bg-slate-700/30 transition-colors"
                    >
                      {/* Avatar */}
                      <td className="p-3 whitespace-nowrap">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-9 h-9 rounded-full object-cover border border-slate-600"
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 flex items-center justify-center rounded-full ${getAvatarColor(user.lastName)} text-white text-sm font-medium border border-slate-600`}
                          >
                            {user.lastName
                              ? user.lastName.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        )}
                      </td>
                      
                      {/* Name */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
                      </td>
                      
                      {/* Email */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{user.email}</div>
                      </td>
                      
                      {/* Phone */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{user.phoneNumber || "-"}</div>
                      </td>
                      
                      {/* Address */}
                      <td className="p-3">
                        <div className="text-sm text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                          {user.address || "-"}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                            user.active === true || user.active === 1
                              ? "bg-green-100/10 text-green-400 border border-green-500/30"
                              : "bg-yellow-100/10 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {user.active === true || user.active === 1
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-md transition-colors"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors"
                            onClick={() => initiateDelete(user)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-slate-400">
                      {searchTerm ? "Không tìm thấy học viên phù hợp với từ khóa tìm kiếm." : "Không có học viên nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                <span className="text-sm">Trước</span>
              </button>

              <div className="flex items-center">
                {(() => {
                  const pages = [];

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <PageButton
                          key={i}
                          page={i}
                          currentPage={currentPage}
                          onClick={() => handlePageChange(i)}
                        />
                      );
                    }
                  } else {
                    // First page
                    pages.push(
                      <PageButton
                        key={1}
                        page={1}
                        currentPage={currentPage}
                        onClick={() => handlePageChange(1)}
                      />
                    );

                    // Add dots if needed
                    if (currentPage > 3) {
                      pages.push(<span key="dots-start" className="px-2 py-2 text-slate-300">…</span>);
                    }

                    // Pages around current
                    for (let i = Math.max(2, currentPage - 2); i <= Math.min(currentPage + 2, totalPages - 1); i++) {
                      pages.push(
                        <PageButton
                          key={i}
                          page={i}
                          currentPage={currentPage}
                          onClick={() => handlePageChange(i)}
                        />
                      );
                    }

                    // Add dots if needed
                    if (currentPage < totalPages - 2) {
                      pages.push(<span key="dots-end" className="px-2 py-2 text-slate-300">…</span>);
                    }

                    // Last page
                    if (totalPages > 1) {
                      pages.push(
                        <PageButton
                          key={totalPages}
                          page={totalPages}
                          currentPage={currentPage}
                          onClick={() => handlePageChange(totalPages)}
                        />
                      );
                    }
                  }

                  return pages;
                })()}
              </div>

              <button
                className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <span className="text-sm">Sau</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default UsersTable;