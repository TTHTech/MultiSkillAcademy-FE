import { useState, useEffect } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import ListCard from "../../../components/instructor/Card/ListCoursesCard";
import { Link } from "react-router-dom";

const userId = localStorage.getItem("userId");

const PageCourses = () => {
    const [open, setOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("pending");
    const [courses, setCourses] = useState([]);

    const [pendingPage, setPendingPage] = useState(1);
    const [approvedPage, setApprovedPage] = useState(1);
    const [unsentPage, setUnsentPage] = useState(1);

    const coursesPerPage = 8;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/instructor/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                console.log(localStorage.getItem("token"))
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    const filterCourses = (status) => {
        return courses.filter((course) => {
            if (status === "pending") return !course.status || course.status === "Unknown";
            if (status === "approved") return ["Active", "Processing", "Inactive"].includes(course.status);
            if (status === "unsent") return course.status === "Unsent";
            return false;
        });
    };

    const paginateCourses = (courseList, page) => {
        const startIndex = (page - 1) * coursesPerPage;
        const endIndex = startIndex + coursesPerPage;
        return courseList.slice(startIndex, endIndex);
    };

    const tabs = [
        { key: "pending", label: "Courses Chưa Duyệt" },
        { key: "approved", label: "Courses Đã Duyệt" },
        { key: "unsent", label: "Courses Chưa Gửi" },
    ];

    const courseLists = {
        pending: filterCourses("pending"),
        approved: filterCourses("approved"),
        unsent: filterCourses("unsent"),
    };

    const pages = {
        pending: pendingPage,
        approved: approvedPage,
        unsent: unsentPage,
    };

    const setPages = {
        pending: setPendingPage,
        approved: setApprovedPage,
        unsent: setUnsentPage,
    };

    return (
        <section className={`flex-1 m-4 p-4 duration-300 font-semibold text-xl text-gray-900 ${open ? "ml-72" : "ml-16"} bg-gradient-to-b from-gray-100 to-blue-100`}>
            <Sidebar open={open} setOpen={setOpen} />

            <div className="space-y-6">
                <div>
                    <Link to="/courses/addCourses">
                        <button className="font-poppins bg-gradient-to-b from-indigo-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-green-400 hover:to-blue-400 focus:outline-none transition-all duration-300">
                            <span>Thêm Courses</span>
                        </button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex justify-center space-x-6 py-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-6 py-3 rounded-full font-medium text-lg transition-all duration-300 ${
                                activeTab === tab.key
                                    ? "bg-blue-600 text-white shadow-xl"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Courses List */}
                <div className="mt-6">
                    {tabs.map((tab) => (
                        activeTab === tab.key && (
                            <div key={tab.key} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                                {courseLists[tab.key].length > 0 ? (
                                    <>
                                        <ListCard courses={paginateCourses(courseLists[tab.key], pages[tab.key])} />
                                        <div className="flex justify-center space-x-3 mt-6">
                                            {[...Array(Math.ceil(courseLists[tab.key].length / coursesPerPage))].map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setPages[tab.key](index + 1)}
                                                    className={`px-4 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
                                                        pages[tab.key] === index + 1
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-200 text-gray-700 hover:bg-blue-300"
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-gray-500">Không có khóa học</p>
                                )}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PageCourses;
