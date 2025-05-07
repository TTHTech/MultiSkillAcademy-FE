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
import TopMarketingCoursesSection from "../../../components/student/home/TopMarketingCoursesSection";
import Footer from "../../../components/student/common/Footer";
import TopDesignCoursesSection from "../../../components/student/home/TopDesignCoursesSection";
import TopTechnologyCoursesSection from "../../../components/student/home/TopTechnologyCoursesSection";
import RecommendedCoursesComponent from "../../../components/student/home/RecommendedCoursesComponent"; // Import mới
import TopDevelopmentCoursesSection from "../../../components/student/home/TopDevelopmentCoursesSection"; // Import mới
import TopBusinessCoursesSection from "../../../components/student/home/TopBusinessCoursesSection"; // Import mới
import TopFinanceCoursesSection from "../../../components/student/home/TopFinanceCoursesSection"; // Import mới
const StudentHomePage = () => {
  return (
    <div className="w-full h-full min-h-screen bg-[#F5F6F8] overflow-y-auto">
      <TopBanner />
      <NavBar />
      <WelcomeSection />
      <HeroSection />
      
      <RecommendedCoursesComponent />
      <SuggestedCoursesSection />
     
      <TopDevelopmentCoursesSection/>
      <TopBusinessCoursesSection/>
      {/* Thêm component TopWebCoursesSection mới */}
      <TopMusicCoursesSection/>
      <TopMarketingCoursesSection />
      <TopDesignCoursesSection/>
     < RecommendedTopics/>
      <TopTechnologyCoursesSection/>
     <TopPythonCoursesSection /> 
     <TopFinanceCoursesSection/>
      <Footer />
    </div>
  );
};

export default StudentHomePage;