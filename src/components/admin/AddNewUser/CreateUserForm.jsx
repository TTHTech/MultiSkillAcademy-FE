import { useState, useEffect } from "react";
import { Camera, Loader, CheckCircle, AlertTriangle, User, Mail, Lock, Phone, MapPin, FileText, Calendar, Users } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

.hover\\:scale-102:hover {
  transform: scale(1.02);
}

.bg-gradient-subtle {
  background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
}
`;

const CreateUserForm = () => {
  // Inject animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [newUser, setNewUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ROLE_STUDENT",
    phoneNumber: "",
    address: "",
    bio: "",
    dateOfBirth: "",
    active: "true",
    profileImage: null,
    profileImagePreview: null,
  });

  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ 
    success: false, 
    error: false, 
    message: "" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });

    // Clear password error when user makes changes to password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser({ 
          ...newUser, 
          profileImage: file,
          profileImagePreview: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onCreateUser = async (userData) => {
    setLoading(true);
    setSubmitStatus({ success: false, error: false, message: "" });
    
    const formData = new FormData();
    formData.append("user", JSON.stringify(userData));

    if (newUser.profileImage) {
      formData.append("profileImage", newUser.profileImage);
    }

    try {
      const response = await fetch(`${baseUrl}/api/admin/users?role=` + userData.role, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const successMessage = `User ${data.firstName} ${data.lastName} created successfully`;
        setSubmitStatus({ 
          success: true, 
          error: false, 
          message: successMessage 
        });
        toast.success(successMessage);
        
        // Reset form
        setNewUser({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "ROLE_STUDENT",
          phoneNumber: "",
          address: "",
          bio: "",
          dateOfBirth: "",
          active: "true",
          profileImage: null,
          profileImagePreview: null,
        });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to create user";
        setSubmitStatus({ 
          success: false, 
          error: true, 
          message: errorMessage 
        });
        toast.error(errorMessage);
      }
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        error: true, 
        message: error.message || "An error occurred" 
      });
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    // Validate required fields
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error("Please fill in all required fields: Username, Email, Password");
      return;
    }
    
    // Validate password match
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    const userData = {
      username: newUser.username,
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

    onCreateUser(userData);
  };

  // Function to determine if a field is required
  const isRequired = (fieldName) => {
    return ['username', 'email', 'password', 'confirmPassword'].includes(fieldName);
  };

  // Get icon color based on field type
  const getIconColor = (fieldType) => {
    const colors = {
      account: "#4f46e5", // indigo
      contact: "#0ea5e9", // sky
      personal: "#8b5cf6", // violet
      security: "#f59e0b", // amber
      default: "#94a3b8"  // slate
    };
    return colors[fieldType] || colors.default;
  };

  // Field renderer with consistent styling and colored icons
  const renderField = (name, label, type = "text", icon = null, placeholder = "", fieldType = "default") => {
    const iconColor = getIconColor(fieldType);
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-200 mb-1.5">
          {label} {isRequired(name) && <span className="text-rose-400">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-2.5" style={{ color: iconColor }}>
              {icon}
            </div>
          )}
          <input
            type={type}
            name={name}
            value={newUser[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full p-2.5 ${icon ? 'pl-10' : 'pl-3'} bg-slate-700/60 text-white rounded-md border border-slate-600/70 focus:border-${fieldType === 'default' ? 'blue' : fieldType}-500/70 focus:ring-1 focus:ring-${fieldType === 'default' ? 'blue' : fieldType}-500/30 transition-all`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-md p-6 border border-slate-700/40 animate-fadeIn shadow-xl">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r mr-3" />
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center">
          <User className="mr-2 text-blue-400" size={24} />
          Create New User
        </h2>
      </div>

      {/* Status message */}
      {submitStatus.message && (
        <div className={`mb-6 p-4 rounded-md animate-scaleIn ${
          submitStatus.success 
            ? 'bg-green-900/20 border border-green-700/30 text-green-400' 
            : 'bg-rose-900/20 border border-rose-700/30 text-rose-400'
        }`}>
          <div className="flex items-start">
            {submitStatus.success ? (
              <CheckCircle className="mr-3 mt-0.5 flex-shrink-0" size={18} />
            ) : (
              <AlertTriangle className="mr-3 mt-0.5 flex-shrink-0" size={18} />
            )}
            <p>{submitStatus.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Account Information */}
        <div className="md:col-span-8 bg-gradient-subtle p-5 rounded-md border border-indigo-500/10">
          <h3 className="text-base font-medium text-indigo-300 border-b border-slate-700/50 pb-2 mb-4 flex items-center">
            <Users className="mr-2 text-indigo-400" size={18} />
            Account Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div>
              {renderField("username", "Username", "text", <User size={18} />, "Enter username", "account")}
            </div>
            
            <div>
              {renderField("email", "Email", "email", <Mail size={18} />, "Enter email address", "account")}
            </div>

            <div>
              {renderField("password", "Password", "password", <Lock size={18} />, "Enter password", "security")}
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-amber-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={`w-full p-2.5 pl-10 bg-slate-700/60 text-white rounded-md border ${
                      passwordError 
                        ? 'border-rose-500/70 focus:border-rose-500/80' 
                        : 'border-slate-600/70 focus:border-amber-500/70'
                    } focus:ring-1 focus:ring-amber-500/30 transition-all`}
                  />
                </div>
                {passwordError && (
                  <p className="mt-1.5 text-rose-400 text-xs flex items-center">
                    <AlertTriangle size={14} className="mr-1" /> {passwordError}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-indigo-400">
                    <Users size={18} />
                  </div>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                    className="w-full p-2.5 pl-10 bg-slate-700/60 text-white rounded-md border border-slate-600/70 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all appearance-none"
                  >
                    <option value="ROLE_STUDENT">Student</option>
                    <option value="ROLE_INSTRUCTOR">Instructor</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-green-400">
                    <CheckCircle size={18} />
                  </div>
                  <select
                    name="active"
                    value={newUser.active}
                    onChange={handleChange}
                    className="w-full p-2.5 pl-10 bg-slate-700/60 text-white rounded-md border border-slate-600/70 focus:border-green-500/70 focus:ring-1 focus:ring-green-500/30 transition-all appearance-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="md:col-span-4 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800/60 to-slate-800/30 rounded-md border border-slate-700/40 p-5">
          <div className="relative mb-3">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-700/70 border-4 border-slate-600/50 flex items-center justify-center">
              {newUser.profileImagePreview ? (
                <img
                  src={newUser.profileImagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-slate-500" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 rounded-full text-white cursor-pointer shadow-md transition-all hover:scale-102 transform">
              <Camera size={18} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-slate-300 text-sm text-center mt-2">
            Profile Picture
          </p>
          <p className="text-slate-400 text-xs text-center">
            Square image recommended
          </p>
        </div>

        {/* Personal Information */}
        <div className="md:col-span-12 bg-gradient-subtle p-5 rounded-md border border-violet-500/10">
          <h3 className="text-base font-medium text-violet-300 border-b border-slate-700/50 pb-2 mb-4 flex items-center">
            <User className="mr-2 text-violet-400" size={18} />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <div>
              {renderField("firstName", "First Name", "text", <User size={18} />, "Enter first name", "personal")}
            </div>
            
            <div>
              {renderField("lastName", "Last Name", "text", <User size={18} />, "Enter last name", "personal")}
            </div>
            
            <div>
              {renderField("dateOfBirth", "Date of Birth", "date", <Calendar size={18} />, "", "personal")}
            </div>
            
            <div>
              {renderField("phoneNumber", "Phone Number", "text", <Phone size={18} />, "Enter phone number", "contact")}
            </div>
            
            <div className="md:col-span-2">
              {renderField("address", "Address", "text", <MapPin size={18} />, "Enter address", "contact")}
            </div>
            
            <div className="md:col-span-3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Bio
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-violet-400">
                    <FileText size={18} />
                  </div>
                  <textarea
                    name="bio"
                    value={newUser.bio}
                    onChange={handleChange}
                    placeholder="Enter bio information"
                    rows="3"
                    className="w-full p-2.5 pl-10 bg-slate-700/60 text-white rounded-md border border-slate-600/70 focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/30 transition-all"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end mt-6 pt-4 border-t border-slate-700/30">
        <button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-md transition-all shadow-md font-medium flex items-center justify-center min-w-[180px] hover:scale-102 transform"
          onClick={handleCreateUser}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Creating...
            </>
          ) : (
            <>
              <User className="mr-2" size={20} />
              Create Account
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateUserForm;