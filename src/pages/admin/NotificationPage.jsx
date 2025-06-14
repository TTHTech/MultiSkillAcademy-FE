import React from "react";
import NotificationList from "../../components/admin/Notifications/NotificationList";
import Header from "../../components/admin/common/Header";

const NotificationPage = () => {
  return (
    <div className="flex-1 overflow-auto bg-[#1a1f2b] min-h-screen">
      <Header title="Thông báo" />
      
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Notifications List */}
        <NotificationList />
      </main>
    </div>
  );
};

export default NotificationPage;