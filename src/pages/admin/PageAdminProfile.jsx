import AdminProfile  from "../../components/admin/ProfileAdmin/AdminProfile";
import Header from "../../components/admin/common/Header";

const PageAdminProfile = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Admin Profile" />
        <AdminProfile />
      </div>
    </div>
  );
};

export default PageAdminProfile;
