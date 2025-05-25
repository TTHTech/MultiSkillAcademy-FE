import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import ChangePassword from "./ChangePassword";

const AdminProfile = () => {
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    profileImageFile: null,
    profileImagePreview: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/admin/profile/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth
            ? `${data.dateOfBirth[0]}-${String(data.dateOfBirth[1]).padStart(
                2,
                "0"
              )}-${String(data.dateOfBirth[2]).padStart(2, "0")}`
            : "",
          profileImagePreview: data.profileImageUrl || "",
        }));
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImageFile: file,
          profileImagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isConfirmed } = await Swal.fire({
      title: "Bạn có chắc chắn muốn lưu thay đổi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có, lưu lại",
      cancelButtonText: "Không",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: "bg-pink-600 text-white hover:bg-pink-700",
        cancelButton: "bg-gray-500 text-white hover:bg-gray-600",
      },
    });

    if (!isConfirmed) return;

    Swal.fire({
      html: `
      <div class="flex flex-col items-center">
        <div class="w-48 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div id="swal-progress" class="h-2 bg-pink-500 w-0"></div>
        </div>
        <span>Đang lưu hồ sơ...</span>
      </div>
    `,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        let progress = 0;
        const progressEl = document.getElementById("swal-progress");
        const interval = setInterval(() => {
          progress = Math.min(progress + 10, 100);
          progressEl.style.width = `${progress}%`;
        }, 200);
        Swal.getPopup().swalInterval = interval;
      },
    });

    setSaving(true);
    setError(null);

    try {
      let imageUrl = profile?.profileImageUrl;

      if (formData.profileImageFile) {
        const imgForm = new FormData();
        imgForm.append("file", formData.profileImageFile);
        const uploadRes = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BASE_URL
          }/api/cloudinary/upload/image`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: imgForm,
          }
        );
        if (!uploadRes.ok) throw new Error("Image upload failed");
        imageUrl = await uploadRes.text();
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        profileImageUrl: imageUrl,
      };

      const res = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/admin/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Profile update failed");

      const updated = await res.json();
      setProfile(updated);
      setSuccess(true);

      Swal.fire({
        icon: "success",
        title: "Lưu thành công!",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Save failed");
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: err.message || "Không thể lưu hồ sơ",
      });
    } finally {
      setSaving(false);
      clearInterval(Swal.getPopup().swalInterval);
      Swal.close();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-center">
        <div className="text-xl font-semibold mb-2">Error Loading Profile</div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-gray-800 rounded-xl shadow-xl">
      <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-8 pb-6 border-b border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">Admin Profile</h2>
        <button
          className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          onClick={() => setShowChangePassword(true)}
        >
          Đổi mật khẩu
        </button>
      </div>
      
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Image Column */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div
            onClick={handleImageClick}
            className="relative group"
          >
            <div className="w-40 h-40 rounded-full border-4 border-pink-500 overflow-hidden cursor-pointer transition duration-300 shadow-lg">
              {formData.profileImagePreview ? (
                <img
                  src={formData.profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-700 text-gray-400">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload
                  </div>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="text-white text-sm font-medium">Change Photo</span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="mt-6 text-center">
            <h3 className="text-2xl font-medium text-white">
              {profile?.firstName} {profile?.lastName}
            </h3>
            <p className="text-gray-400 mt-1">{profile?.email}</p>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-8">
          {success && (
            <div className="mb-6 p-4 bg-green-800/30 border border-green-600 text-green-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Profile updated successfully!
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Last Name", name: "lastName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phoneNumber", type: "text" },
              { label: "Address", name: "address", type: "text" },
              { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block font-medium text-gray-200">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}

            <div className="md:col-span-2 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 font-medium"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;