import React, { useState } from "react";
import Sidebar from "../../components/instructor/Sidebar/Sidebar";
import User from "../../components/instructor/User/User";
const Home = () => {
  const [open, setOpen] = useState(true);

  return (
    <section className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-green-100 to-blue-200 min-h-screen ${open ? "ml-72" : "ml-16"}`}>
      <Sidebar open={open} setOpen={setOpen} />
      <div className="m-3 text-xl text-gray-900 font-semibold">
        <User />
      </div>
    </section>
  );
};

export default Home;
