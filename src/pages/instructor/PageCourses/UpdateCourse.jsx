import SidebarEditCourse from "../../../components/instructor/Sidebar/SidebarEditCourse";
import NavbarEditCourse from "../../../components/instructor/Sidebar/NavbarEditCourse";
import CourseContent from "../../../components/instructor/Content/CourseContent";
import CourseDetails from "../../../components/instructor/Content/CourseDetails";
import ManageFreeLectures from "../../../components/instructor/Content/ManageFreeLectures";
import Requirements from "../../../components/instructor/Content/Requirements";
import ResourceDescription from "../../../components/instructor/Content/ResourceDescription";
import SectionsAndLectures from "../../../components/instructor/Content/SectionsAndLectures";
import TargetAudience from "../../../components/instructor/Content/TargetAudience";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const UpdateCourse = () => {
  const [selectedComponent, setSelectedComponent] = useState("CourseDetails");
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/instructor/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCourse();
  }, [id]);
  const componentMap = {
    CourseDetails: <CourseDetails />,
    TargetAudience: <TargetAudience />,
    CourseContent: <CourseContent />,
    ResourceDescription: <ResourceDescription />,
    Requirements: <Requirements />,
    ManageFreeLectures: <ManageFreeLectures />,
    SectionsAndLectures: <SectionsAndLectures />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <NavbarEditCourse title={course?.title} status={course?.status} />
      </div>
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <SidebarEditCourse onSelect={setSelectedComponent} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Hiển thị component theo lựa chọn */}
          <div className="bg-white p-6 shadow-md rounded-lg mt-4">
            {componentMap[selectedComponent] || <p>Chọn một mục từ menu để chỉnh sửa.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;
