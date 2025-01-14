import { motion } from "framer-motion";
import Header from "../../components/admin/common/Header";
import AddNotification from "../../components/admin/Notifications/AddNotification";


const AddNotificationPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add Notification" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <AddNotification />
      </main>
    </div>
  );
};

export default AddNotificationPage;
