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

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-xl mt-8 mb-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-100">Admin Profile</h2>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
          onClick={() => setShowChangePassword(true)}
        >
          Đổi mật khẩu
        </button>
      </div>
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="flex flex-col items-center">
          <div
            onClick={handleImageClick}
            className={`w-32 h-32 rounded-full border-4 border-pink-500 overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300
              ${loading ? "bg-gray-700 animate-pulse" : "bg-gray-700"}`}
          >
            {formData.profileImagePreview ? (
              <img
                src={formData.profileImagePreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Upload
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="mt-4 text-center">
            <p className="text-xl font-medium text-gray-100">
              {profile?.firstName} {profile?.lastName}
            </p>
            <p className="text-gray-400">{profile?.email}</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          {success && (
            <div className="mb-4 p-4 bg-green-700 text-green-100 rounded">
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
              <div key={field.name}>
                <label className="block mb-2 font-medium text-gray-200">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-100"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving && (
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
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
