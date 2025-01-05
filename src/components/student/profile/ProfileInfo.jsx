import React, { useState, useEffect } from "react";
import { Camera, Loader2, Save, X, Edit3 } from "lucide-react";

const Alert = ({ variant = "default", children }) => (
  <div className={`p-4 rounded-lg ${
    variant === "destructive" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
  }`}>
    {children}
  </div>
);

const AlertDescription = ({ children }) => (
  <p className="text-sm">{children}</p>
);

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl flex items-center gap-3">
      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      <p>Đang xử lý...</p>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {type === "textarea" ? (
      <textarea
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
        rows={3}
      />
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
      />
    )}
  </div>
);

const ProfileInfo = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
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
        `http://localhost:8080/api/student/profile/${userId}`,
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
        `http://localhost:8080/api/student/profile/${userId}`,
        {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${token}`,
            // Không set Content-Type khi gửi FormData để browser tự xử lý
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
      
      // Fetch lại profile để lấy URL ảnh mới
      fetchProfile();

      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-[80px] mb-[60px]">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={formData.image 
                  ? URL.createObjectURL(formData.image)
                  : profile?.profileImage || "/default-avatar.png"
                }
                alt="Profile"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="h-5 w-5 text-gray-600" />
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
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              Chỉnh sửa
            </button>
          ) : (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors"
              >
                <X className="h-4 w-4" />
                Hủy
              </button>
            </div>
          )}
        </div>

        <div className="p-8 pt-20">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-600">Tên đăng nhập</p>
                <p className="text-lg text-gray-900">{profile?.username || 'Chưa có thông tin'}</p>
              </div>
            </div>

            <InputField
              label="Họ"
              value={isEditing ? formData.lastName : profile?.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
            />

            <InputField
              label="Tên"
              value={isEditing ? formData.firstName : profile?.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
            />

            <InputField
              label="Email"
              value={profile?.email}
              disabled={true}
            />

            <InputField
              label="Số điện thoại"
              value={isEditing ? formData.phone : profile?.phoneNumber}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              type="tel"
            />

            <InputField
              label="Ngày sinh"
              value={isEditing ? formData.dateOfBirth : profile?.dateOfBirth}
              onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              disabled={!isEditing}
              type="date"
            />

            <div className="col-span-2">
              <InputField
                label="Địa chỉ"
                value={isEditing ? formData.address : profile?.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                disabled={!isEditing}
                type="textarea"
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