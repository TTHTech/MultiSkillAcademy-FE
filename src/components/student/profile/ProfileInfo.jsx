import React, { useState, useEffect } from "react";
import { Camera, Loader2, Save, X, Edit3, User, Mail, Phone, Calendar, MapPin, Briefcase, UserCircle } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Alert = ({ variant = "default", children }) => (
  <div className={`p-4 border-l-4 rounded-r-lg mb-6 flex items-start ${
    variant === "destructive" 
      ? "bg-red-50 border-red-500 text-red-800" 
      : variant === "success"
      ? "bg-green-50 border-green-500 text-green-800"
      : "bg-blue-50 border-blue-500 text-blue-800"
  }`}>
    <div className="flex-1">{children}</div>
  </div>
);

const AlertDescription = ({ children }) => (
  <p className="text-sm font-medium">{children}</p>
);

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl flex items-center gap-3 shadow-xl">
      <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
      <p className="font-medium text-gray-700">Đang xử lý...</p>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = "text", disabled = false, icon: Icon, placeholder = "" }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 ${disabled ? 'text-gray-400' : 'text-indigo-400 group-focus-within:text-indigo-500'} transition-colors duration-200`} />
        </div>
      )}
      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full p-3 ${Icon ? 'pl-10' : ''} border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 ${!disabled && 'hover:border-indigo-300'}`}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full p-3 ${Icon ? 'pl-10' : ''} border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 ${!disabled && 'hover:border-indigo-300'}`}
        />
      )}
    </div>
  </div>
);

const ProfileBadge = ({ label, value }) => (
  <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
    <span className="text-xs font-medium text-indigo-600">{label}:</span>
    <span className="text-xs font-semibold text-gray-700">{value}</span>
  </div>
);

const ProfileInfo = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        throw new Error("Không tìm thấy thông tin xác thực");
      }

      const response = await fetch(
        `${baseUrl}/api/student/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error("Không thể tải thông tin");

      const data = await response.json();
      const formattedDate = Array.isArray(data.dateOfBirth)
        ? data.dateOfBirth.join("-")
        : data.dateOfBirth;

      setProfile({ ...data, dateOfBirth: formattedDate });
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: formattedDate,
        phone: data.phoneNumber,
        address: data.address
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleUpdate = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) throw new Error("Không tìm thấy thông tin xác thực");

      const formDataToSend = new FormData();
      const studentData = {
        firstName: formData.firstName || profile.firstName,
        lastName: formData.lastName || profile.lastName,
        dateOfBirth: formData.dateOfBirth || profile.dateOfBirth,
        phoneNumber: formData.phone || profile.phoneNumber,
        address: formData.address || profile.address
      };

      formDataToSend.append("student", JSON.stringify(studentData));
      if (formData.image) {
        formDataToSend.append("profileImage", formData.image);
      }

      const response = await fetch(
        `${baseUrl}/api/student/profile/${userId}`,
        {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend
        }
      );

      if (!response.ok) throw new Error("Cập nhật không thành công");

      const updatedProfile = await response.json();
      setProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));
      
      await fetchProfile();
      setIsEditing(false);
      setSuccess("Thông tin cá nhân đã được cập nhật thành công");
      
      // Tự động ẩn thông báo thành công sau 5 giây
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-[600px] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Đang tải thông tin...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-[80px] mb-[60px] px-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Thông tin cá nhân</h1>
        <p className="text-gray-500">Xem và cập nhật thông tin cá nhân của bạn</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Banner */}
        <div className="relative h-48 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400">
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
          
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                {profile?.profileImage || formData.image ? (
                  <img
                    src={formData.image 
                      ? URL.createObjectURL(formData.image)
                      : profile?.profileImage
                    }
                    alt="Profile"
                    onError={(e) => {
                      e.target.src = "https://lh3.googleusercontent.com/IUCQIQksFr7qJDlXK43uhIUwvDt_tpLSNiumv8bFESGLs6wekNyBDdNMyzeFwqgTe-l5vG6RSMvnUek=w544-h544-l90-rj";
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                    <UserCircle className="w-16 h-16 text-indigo-300" />
                  </div>
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:scale-110 border border-indigo-100">
                  <Camera className="h-5 w-5 text-indigo-600" />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 font-medium shadow-sm"
            >
              <Edit3 className="h-4 w-4" />
              Chỉnh sửa
            </button>
          ) : (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-105 font-medium shadow-sm"
              >
                <Save className="h-4 w-4" />
                Lưu thay đổi
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    ...profile,
                    image: null
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 font-medium shadow-sm"
              >
                <X className="h-4 w-4" />
                Hủy
              </button>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="p-8 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <Briefcase className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-600 mb-1">Tên đăng nhập</p>
                    <p className="text-lg font-semibold text-gray-900">{profile?.username || 'Chưa có thông tin'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <InputField
              label="Họ"
              value={isEditing ? formData.lastName : profile?.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
              icon={User}
              placeholder="Nhập họ của bạn"
            />

            <InputField
              label="Tên"
              value={isEditing ? formData.firstName : profile?.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
              icon={User}
              placeholder="Nhập tên của bạn"
            />

            <InputField
              label="Email"
              value={profile?.email}
              disabled={true}
              icon={Mail}
            />

            <InputField
              label="Số điện thoại"
              value={isEditing ? formData.phone : profile?.phoneNumber}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              type="tel"
              icon={Phone}
              placeholder="Nhập số điện thoại của bạn"
            />

            <InputField
              label="Ngày sinh"
              value={isEditing ? formData.dateOfBirth : profile?.dateOfBirth}
              onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              disabled={!isEditing}
              type="date"
              icon={Calendar}
            />

            <div className="col-span-1 md:col-span-2">
              <InputField
                label="Địa chỉ"
                value={isEditing ? formData.address : profile?.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                disabled={!isEditing}
                type="textarea"
                icon={MapPin}
                placeholder="Nhập địa chỉ của bạn"
              />
            </div>
          </div>
        </div>
      </div>

      {isProcessing && <LoadingSpinner />}
    </div>
  );
};

export default ProfileInfo;