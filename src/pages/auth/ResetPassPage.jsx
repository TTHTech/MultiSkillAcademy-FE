import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../../components/admin/common/Header";
import ResetPassForm from "../../components/auth/ResetPassForm";
import Footer from "../../components/student/common/Footer";
import { ToastContainer } from "react-toastify";

const BACKGROUND_IMAGE = "https://img2.thuthuatphanmem.vn/uploads/2018/12/30/background-dep-ppt_110341618.jpg"; // Đặt đường dẫn ảnh (đặt ảnh trong thư mục public)

const ResetPassPage = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleGoToLogin = () => {
    navigate("/login"); // Điều hướng về trang login
  };

  return (
    <div
      className="flex-1 overflow-auto relative z-10 flex flex-col min-h-screen"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE})`, // Đặt ảnh nền
        backgroundSize: "cover", // Đảm bảo ảnh phủ toàn màn hình
        backgroundPosition: "center", // Căn giữa ảnh
        backgroundRepeat: "no-repeat", // Không lặp lại ảnh
      }}
    >
      {/* Thay đổi Header để điều hướng */}
      <div
        className="cursor-pointer"
        onClick={handleGoToLogin} // Gọi hàm điều hướng khi nhấn
      >
        <Header title="Reset Password" />
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 flex-grow">
        {/* Form reset mật khẩu */}
        <ResetPassForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default ResetPassPage;
