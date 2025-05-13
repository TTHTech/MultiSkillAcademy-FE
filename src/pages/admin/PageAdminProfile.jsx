import AdminProfile from "../../components/admin/ProfileAdmin/AdminProfile";
import Header from "../../components/admin/common/Header";

const PageAdminProfile = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header stays at the top */}
      <Header title="Admin Profile" />
      
      {/* Center the AdminProfile with proper spacing */}
      <div className="flex justify-center items-start py-6">
        <div className="w-full max-w-6xl px-4">
          <AdminProfile />
        </div>
      </div>
    </div>
  );
};

export default PageAdminProfile;