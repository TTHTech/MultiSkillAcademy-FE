import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import { useState } from "react";
import Profile from "../../../components/instructor/User/Profile";
const PageProfile = () => {
  const [open, setOpen] = useState(true);
  return (
    <section className={`${open ? "ml-72" : "ml-16"}`}>
      <Sidebar open={open} setOpen={setOpen} />
      <Profile />
    </section>
  );
};

export default PageProfile;
