import Sidebar from "../../components/instructor/Sidebar/Sidebar";
import React, { useState } from "react";
import Dashboard from "./Dashboard/Dashboard";

const PageUser = () => {
  const [open, setOpen] = useState(true);
  return (
    <section
      className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-blue-100 shadow-lg rounded-lg min-h-screen ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} />
      <div className="m-3 text-xl text-gray-900 font-semibold">
        <Dashboard />
      </div>
    </section>
  );
};
export default PageUser;
