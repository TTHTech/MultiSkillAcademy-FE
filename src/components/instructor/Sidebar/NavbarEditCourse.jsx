import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title, status }) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center shadow-md justify-between">
      <div className="flex items-center space-x-4">
        <button
          className="flex items-center text-gray-300 hover:text-white transition-all duration-300"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} className="hover:scale-110" />
          <span className="ml-2 text-base">Quay lại khóa học</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg">{title}</span>
          <span className="bg-gray-700 text-xs text-white px-3 py-1 rounded-full shadow-sm">
            {status}
          </span>
          {/* <span className="text-gray-400 text-sm italic">
            Đã tải <span className="text-white font-medium">0 phút</span> nội dung video lên
          </span> */}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
