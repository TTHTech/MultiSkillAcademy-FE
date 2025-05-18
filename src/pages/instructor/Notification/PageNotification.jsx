import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import { useState } from "react";
import Notification from "../../../components/instructor/Notification/notification";
const PageNotification = () => {
  const [open, setOpen] = useState(true);
  return (
    <section className={`${open ? "ml-72" : "ml-16"}`}>
      <Sidebar open={open} setOpen={setOpen} />
      <Notification />
    </section>
  );
};

export default PageNotification;
