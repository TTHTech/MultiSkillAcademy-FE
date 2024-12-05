import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import CourseViewer from "../../../components/student/content/CourseViewer.jsx"; // Đảm bảo import đúng
import { useParams } from "react-router-dom";

const CourseViewerPage = () => {
  const { id } = useParams(); // Lấy id khóa học từ URL

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <NavBar />

      {/* Content */}
      <div className="flex-grow bg-gray-100">
        <CourseViewer id={id} /> {/* Truyền id khóa học cho CourseViewer */}
      </div>

      {/* Footer */}
      <Footer className="mt-auto" /> {/* Đảm bảo footer luôn ở cuối */}
    </div>
  );
};

export default CourseViewerPage;
