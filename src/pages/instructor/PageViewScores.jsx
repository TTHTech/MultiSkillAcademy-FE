import { useState } from "react";
import Sidebar from "../../components/instructor/Sidebar/Sidebar";
import ScoreTable from "../../components/instructor/Table/ScoreTable";
const Home = () => {
  const [open, setOpen] = useState(true);

  return (
    <section className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-gray-100 min-h-screen ${open ? "ml-72" : "ml-16"}`}>
      <Sidebar open={open} setOpen={setOpen} />
      <div className="m-3 text-xl text-gray-900 font-semibold">
        <ScoreTable />
      </div>
    </section>
  );
};

export default Home;
