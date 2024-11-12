import React from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { ImBook } from "react-icons/im";
import { AiOutlineUser } from "react-icons/ai";
import { PiStudentFill } from "react-icons/pi";
import { FaSignOutAlt } from "react-icons/fa";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const menus = [
    { name: "User", link: "/user", icon: AiOutlineUser },
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "Courses", link: "/courses", icon: ImBook },
    { name: "Questions", link: "/questions", icon: BsFillQuestionSquareFill },
    { name: "Students", link: "/students", icon: PiStudentFill },
    { name: "Sign Out", link: "/signout", icon: FaSignOutAlt },
  ];

  return (
    <div
      className={`bg-white min-h-screen ${
        open ? "w-72" : "w-16"
      } duration-300 text-gray-900 px-4 shadow-lg fixed`}
      style={{ top: 0, left: 0, zIndex: 100 }}
    >
      <div className="py-3 flex justify-end">
        <HiMenuAlt3
          size={26}
          className="cursor-pointer text-gray-600"
          onClick={() => setOpen(!open)}
        />
      </div>
      <div className="mt-4 flex flex-col gap-4 relative">
        {menus?.map((menu, i) => (
          <Link
            to={menu?.link}
            key={i}
            className={`group flex items-center text-sm gap-3.5 font-medium p-2 rounded-md
              ${
                location.pathname.startsWith(menu.link) 
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-800 text-gray-600 hover:text-white"
              }
            `}
          >
            <div className="flex items-center">
              {React.createElement(menu?.icon, { size: "20" })}
              <h2
                className={`ml-2 whitespace-pre ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
            </div>
            <h2
              className={`${
                open && "hidden"
              } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:w-fit z-50`}
              style={{ zIndex: 150 }}
            >
              {menu?.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
