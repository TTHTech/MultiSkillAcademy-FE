// src/pages/student/home/StudentHomePage.jsx
import React from "react";
import TopBanner from "../../../components/student/home/TopBanner";
import NavBar from "../../../components/student/common/NavBar";
import HeroSection from "../../../components/student/home/HeroSection";
import WelcomeSection from "../../../components/student/home/WelcomeSection";
import FeaturedCourses from "../../../components/student/home/FeaturedCourses";
import SuggestedCoursesSection from "../../../components/student/home/SuggestedCoursesSection";
import RecommendedCoursesSection from "../../../components/student/home/RecommendedCoursesSection";
import TopPythonCoursesSection from "../../../components/student/home/TopPythonCoursesSection"; // Import mới
import TopMusicCoursesSection from "../../../components/student/home/TopMusicCoursesSection";
import RecommendedTopics from "../../../components/student/home/RecommendedTopics";

import Footer from "../../../components/student/common/Footer";

const StudentHomePage = () => {
  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto">
      <TopBanner />
      <NavBar />
      <WelcomeSection />
      <HeroSection />
      
  
      <SuggestedCoursesSection />
      <RecommendedCoursesSection />
      <TopPythonCoursesSection /> {/* Thêm component TopWebCoursesSection mới */}
      <TopMusicCoursesSection/>
     < RecommendedTopics/>
      <Footer />
    </div>
  );
};

export default StudentHomePage;