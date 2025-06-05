import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import Notifications from "../../../components/student/notifications/Notifications"
const PageNotifications = () => {
  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto">
      <NavBar />
      
      <div className="container mx-auto p-6 bg-white">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 pb-4">Thông Báo</h1>
        <Notifications />
      </div>
      
      <Footer />
    </div>
  );
};

export default PageNotifications;
