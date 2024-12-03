import NavBar from "../../../components/student/common/NavBar";
import StudyMyCourse from "../../../components/student/content/StudyMyCourse";

const CourseViewer = () => {
  return (
    <div className="flex flex-col h-screen">
    {/* Navbar */}
    <NavBar />

    {/* Content */}
    <div className="flex-grow bg-gray-100">
      <StudyMyCourse />
    </div>
  </div>
  );
};

export default CourseViewer;
