import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import CreateDiscount from "../../../components/instructor/Discount/CreateDiscount";
import DiscountTable from "../../../components/instructor/Discount/discountsTable";
import { useState } from "react";
const PageUser = () => {
  const [open, setOpen] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  return (
    <section
      className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-gray-100 shadow-lg rounded-lg min-h-screen ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} />
      {showCreate ? (
        <div className="p-6">
          <button
            onClick={() => setShowCreate(false)}
            className="mb-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Quay lại
          </button>
          <CreateDiscount />
        </div>
      ) : (
        <div className="p-6">
          <button
            onClick={() => setShowCreate(true)}
            className="mb-4 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
          >
            Tạo Discount
          </button>
          <DiscountTable />
        </div>
      )}
    </section>
  );
};
export default PageUser;
