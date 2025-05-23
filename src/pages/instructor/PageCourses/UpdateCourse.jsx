import SidebarEditCourse from "../../../components/instructor/Sidebar/SidebarEditCourse";
import NavbarEditCourse from "../../../components/instructor/Sidebar/NavbarEditCourse";
import CourseContent from "../../../components/instructor/Content/CourseContent";
import CourseDetails from "../../../components/instructor/Content/CourseDetails";
import ManageFreeLectures from "../../../components/instructor/Content/ManageFreeLectures";
import Requirements from "../../../components/instructor/Content/Requirements";
import ResourceDescription from "../../../components/instructor/Content/ResourceDescription";
import SectionsAndLectures from "../../../components/instructor/Content/SectionsAndLectures";
import TargetAudience from "../../../components/instructor/Content/TargetAudience";
import ChangeStatus from "../../../components/instructor/Content/ChangeStatus";
import SupplementaryLectures from "../../../components/instructor/Content/SupplementaryLectures";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const UpdateCourse = () => {
  const [selectedComponent, setSelectedComponent] = useState("CourseDetails");
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const userId = localStorage.getItem("userId");
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const ownershipResponse = await fetch(
          `${baseUrl}/api/instructor/courses/${id}/check-ownership?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!ownershipResponse.ok) {
          const errorMessage = await ownershipResponse.text();
          setError(errorMessage);
          return;
        }
        const response = await fetch(
          `${baseUrl}/api/instructor/courses/${id}`,
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
  }, [id, userId, refresh]);
  const componentMap = {
    CourseDetails: <CourseDetails />,
    TargetAudience: <TargetAudience />,
    CourseContent: <CourseContent />,
    ResourceDescription: <ResourceDescription />,
    Requirements: <Requirements />,
    ManageFreeLectures: <ManageFreeLectures />,
    SectionsAndLectures: <SectionsAndLectures />,
    SupplementaryLectures: <SupplementaryLectures courseId={course?.courseId}/>,
    ChangeStatus: <ChangeStatus title={course?.title} courseId={course?.courseId} status={course?.status}  triggerRefresh={triggerRefresh} />,
  };
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
          <NavbarEditCourse title={course?.title} status={course?.status} />
        </div>
        <div className="flex flex-1 pt-16 items-center justify-center">
          <div className="max-w-lg w-full bg-white border-l-4 border-red-500 p-10 rounded-md shadow-lg">
            <div className="flex items-center mb-6">
              <svg
                className="w-10 h-10 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01"
                />
              </svg>
              <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
            </div>
            <p className="text-lg text-gray-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavbarEditCourse title={course?.title} status={course?.status} />
      </div>
      <div className="flex flex-1 pt-16">
        <SidebarEditCourse onSelect={setSelectedComponent} />
        <div className="flex-1 p-6">
          <div className="bg-white p-6 shadow-md rounded-lg mt-4">
            {componentMap[selectedComponent] || (
              <p>Chọn một mục từ menu để chỉnh sửa.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;
