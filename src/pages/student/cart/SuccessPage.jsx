// src/pages/student/home/StudentHomePage.jsx
import React from "react";
import TopBanner from "../../../components/student/home/TopBanner";
import NavBar from "../../../components/student/common/NavBar";
import SuccessForm from "../../../components/student/cart/SuccessForm";
import Footer from "../../../components/student/common/Footer";

const SuccessPage = () => {
  return (
    <div className="w-full h-full min-h-screen bg-gray-50 overflow-y-auto">
      <TopBanner />
      <NavBar />
        <SuccessForm />
      <Footer />
    </div>
  );
};

export default SuccessPage;