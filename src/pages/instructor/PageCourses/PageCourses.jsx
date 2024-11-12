import { useState, useEffect } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import ListCard from "../../../components/instructor/Card/ListCoursesCard"
import { FaArrowUp } from 'react-icons/fa';
import { Link } from "react-router-dom";

const PageCourses = () => {
    const [open, setOpen] = useState(true);
    const [showPending, setShowPending] = useState(true);
    const [showApproved, setShowApproved] = useState(true);
    const [showUnsent, setShowUnsent] = useState(true); 
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/instructor/1', {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses: ", error);
            }
        };
        fetchCourses();
    }, []);

    const filterCourses = (status) => {
        return courses.filter(course => {
            if (status === "pending") {
                return !course.status || course.status === "Unknown";
            } else if (status === "approved") {
                return ["Active", "Processing", "Inactive"].includes(course.status);
            } else if (status === "Unsent") {
                return course.status === "Unsent"; 
            }
            return false;
        });
    };
    const pendingCourses = filterCourses("pending");
    const approvedCourses = filterCourses("approved");
    const unsentCourses = filterCourses("Unsent");

    return (
        <section className={`flex-1 m-4 p-4 duration-300 font-semibold text-xl text-gray-900 ${open ? "ml-72" : "ml-16"} bg-gradient-to-b from-gray-100 to-blue-100`}>
            <Sidebar open={open} setOpen={setOpen} />

            <div className="space-y-6">
                <div>
                    <Link to="/courses/addCourses">
                        <button className="font-poppins bg-gradient-to-b from-red-200 to-blue-200 text-black px-4 py-2 rounded-lg shadow-md hover:from-green-300 hover:to-blue-300 focus:outline-none transition duration-300">
                            <span>Thêm Courses</span>
                        </button>
                    </Link>
                </div>

                <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                    <button
                        className="flex items-center justify-between w-full text-blue-600 bg-blue-100 hover:bg-gray-100 rounded-lg px-4 py-2 font-medium"
                        onClick={() => setShowPending(prev => !prev)}
                        aria-expanded={showPending}
                    >
                        <span>Courses Chưa Duyệt</span>
                        <span className={`transition-transform duration-300 ${showPending ? "rotate-180" : ""}`}>
                            <FaArrowUp />
                        </span>
                    </button>
                    {showPending && (
                        <div className="mt-4">
                            {pendingCourses.length > 0 ? (
                                <ListCard courses={pendingCourses} />
                            ) : (
                                <p className="text-center text-gray-500">Không có khóa học chờ duyệt</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <button
                        className="flex items-center justify-between w-full text-green-600 bg-green-100 hover:bg-gray-100 rounded-lg px-4 py-2 font-medium"
                        onClick={() => setShowApproved(prev => !prev)}
                        aria-expanded={showApproved}
                    >
                        <span>Courses Đã Duyệt</span>
                        <span className={`transition-transform duration-300 ${showApproved ? "rotate-180" : ""}`}>
                            <FaArrowUp />
                        </span>
                    </button>
                    {showApproved && (
                        <div className="mt-4">
                            {approvedCourses.length > 0 ? (
                                <ListCard courses={approvedCourses} />
                            ) : (
                                <p className="text-center text-gray-500">Không có khóa học đã duyệt</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                    <button
                        className="flex items-center justify-between w-full text-gray-600 bg-gray-200 hover:bg-gray-100 rounded-lg px-4 py-2 font-medium"
                        onClick={() => setShowUnsent(prev => !prev)}
                        aria-expanded={showUnsent}
                    >
                        <span>Courses Chưa Gửi</span>
                        <span className={`transition-transform duration-300 ${showUnsent ? "rotate-180" : ""}`}>
                            <FaArrowUp />
                        </span>
                    </button>
                    {showUnsent && (
                        <div className="mt-4">
                            {unsentCourses.length > 0 ? (
                                <ListCard courses={unsentCourses} />
                            ) : (
                                <p className="text-center text-gray-500">Không có khóa học chưa gửi</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PageCourses;
