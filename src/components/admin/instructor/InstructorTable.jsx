import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Camera, Edit, Trash2, ChevronLeft, ChevronRight, Loader, AlertTriangle, X } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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

// Constants
const ITEMS_PER_PAGE = 5;

// Function to generate a consistent color for avatar
const getAvatarColor = (name) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-pink-500",
  ];
  
  // Use name to generate consistent color for the same instructor
  const charCodeSum = name?.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) || 0;
  return colors[charCodeSum % colors.length];
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ instructor, onConfirm, onCancel }) => (
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
          <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
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
          Are you sure you want to delete the instructor <span className="font-semibold text-white">{instructor.firstName} {instructor.lastName}</span>?
        </p>
        <p className="mt-2 text-slate-400 text-sm text-center">This action cannot be undone.</p>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm"
        >
          Delete Instructor
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

const InstructorsTable = () => {
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
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);

  // Fetch instructors from API
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login first.");
        }

        const response = await fetch(
          `${baseUrl}/api/admin/instructors`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  // Calculate total pages
  const totalPages = Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE);

  // Get instructors for current page
  const currentInstructors = filteredInstructors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = instructors.filter(
      (instructor) =>
        `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        instructor.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredInstructors(filtered);
    setCurrentPage(1);
  };

  // Handle edit instructor
  const handleEdit = (instructor) => {
    setEditingInstructor({...instructor});
  };

  // Open delete confirmation dialog
  const initiateDelete = (instructor) => {
    setInstructorToDelete(instructor);
    setShowDeleteConfirm(true);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setInstructorToDelete(null);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!instructorToDelete) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/instructors/${instructorToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete instructor");
      }

      // Update instructor list after deletion
      const updatedInstructors = instructors.filter((instructor) => instructor.id !== instructorToDelete.id);
      setInstructors(updatedInstructors);
      setFilteredInstructors(updatedInstructors);
      
      // Close modal
      setShowDeleteConfirm(false);
      setInstructorToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle save after editing
  const handleSave = async () => {
    const formData = new FormData();

    // Add instructor data as JSON string
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

    formData.append("instructor", JSON.stringify(instructorData));

    // Add profile image if there's a new one
    if (editingInstructor.profileImageFile) {
      formData.append("profileImage", editingInstructor.profileImageFile);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/instructors/${editingInstructor.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update instructor");
      }

      const updatedInstructor = await response.json();
      // Update instructor list
      const updatedInstructors = instructors.map((instructor) =>
        instructor.id === editingInstructor.id ? updatedInstructor : instructor
      );
      setInstructors(updatedInstructors);
      setFilteredInstructors(updatedInstructors);
      setEditingInstructor(null);
    } catch (error) {
      console.error("Error updating instructor:", error);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "active" ? value === "true" : value;
    setEditingInstructor({ ...editingInstructor, [name]: formattedValue });
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingInstructor({
          ...editingInstructor,
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
          <p className="text-slate-300 text-sm">Loading instructors data...</p>
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
          <h3 className="font-medium text-base mb-1">Error</h3>
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
      {showDeleteConfirm && instructorToDelete && (
        <DeleteConfirmationModal
          instructor={instructorToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Header with title and search */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-1.5 h-8 bg-blue-500 rounded-r mr-3" />
          <h2 className="text-xl font-semibold text-white tracking-tight">Instructors Management</h2>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search instructors..."
            className="w-full bg-slate-800/80 text-slate-200 placeholder-slate-400 rounded-md pl-9 pr-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        </div>
      </div>

      {editingInstructor ? (
        // Edit instructor form
        <div className="bg-slate-800/40 rounded-md p-5 backdrop-blur-sm border border-slate-700/30 animate-fadeIn">
          <div className="flex items-center mb-5">
            <div className="w-1.5 h-8 bg-blue-500 rounded-r mr-3" />
            <h3 className="text-lg font-semibold text-white">Edit Instructor Profile</h3>
          </div>

          {/* Profile image */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={
                  editingInstructor.profileImage ||
                  "https://th.bing.com/th/id/OIP.xqYunaXLEIiIBgbHGncjBQHaHa?rs=1&pid=ImgDetMain"
                }
                alt={editingInstructor.firstName}
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
              <label className="block text-sm font-medium text-slate-300 mb-1.5">First Name</label>
              <input
                type="text"
                name="firstName"
                value={editingInstructor.firstName || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={editingInstructor.lastName || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={editingInstructor.email || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={editingInstructor.phoneNumber || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={
                  editingInstructor.dateOfBirth
                    ? new Date(editingInstructor.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
              <select
                name="role"
                value={editingInstructor.role || 'Instructor'}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              >
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
              <select
                name="active"
                value={editingInstructor.active ? "true" : "false"}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Address</label>
              <input
                type="text"
                name="address"
                value={editingInstructor.address || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 text-white rounded-md border border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={editingInstructor.bio || ''}
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
              <span>Save Changes</span>
            </button>
            <button
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-md transition-all font-medium text-sm transform hover:scale-101"
              onClick={() => setEditingInstructor(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // Instructors table
        <>
          <div className="overflow-x-auto rounded-md border border-slate-700/40">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800/90 to-slate-800/70 border-b border-slate-700/40">
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Avatar</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Address</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {currentInstructors.length > 0 ? (
                  currentInstructors.map((instructor) => (
                    <tr 
                      key={instructor.id} 
                      className="bg-slate-800/20 hover:bg-slate-700/30 transition-colors"
                    >
                      {/* Avatar */}
                      <td className="p-3 whitespace-nowrap">
                        {instructor.profileImage ? (
                          <img
                            src={instructor.profileImage}
                            alt={`${instructor.firstName} ${instructor.lastName}`}
                            className="w-9 h-9 rounded-full object-cover border border-slate-600"
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 flex items-center justify-center rounded-full ${getAvatarColor(instructor.lastName)} text-white text-sm font-medium border border-slate-600`}
                          >
                            {instructor.lastName
                              ? instructor.lastName.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        )}
                      </td>
                      
                      {/* Name */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-medium text-white">{instructor.firstName} {instructor.lastName}</div>
                      </td>
                      
                      {/* Email */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{instructor.email}</div>
                      </td>
                      
                      {/* Phone */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{instructor.phoneNumber || "-"}</div>
                      </td>
                      
                      {/* Address */}
                      <td className="p-3">
                        <div className="text-sm text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                          {instructor.address || "-"}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                            instructor.active === true || instructor.active === 1
                              ? "bg-green-100/10 text-green-400 border border-green-500/30"
                              : "bg-yellow-100/10 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {instructor.active === true || instructor.active === 1
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-md transition-colors"
                            onClick={() => handleEdit(instructor)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors"
                            onClick={() => initiateDelete(instructor)}
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
                      {searchTerm ? "No instructors match your search criteria." : "No instructors available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredInstructors.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                <span className="text-sm">Previous</span>
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
                <span className="text-sm">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default InstructorsTable;