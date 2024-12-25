import Header from "../../components/admin/common/Header";
import LoginForm from "../../components/auth/LoginForm";
import Footer from "../../components/student/common/Footer";
const BACKGROUND_IMAGE = "https://img2.thuthuatphanmem.vn/uploads/2018/12/30/background-dep-ppt_110341618.jpg"; // Đặt đường dẫn ảnh (đặt ảnh trong thư mục public)

// Component Footer


const LoginPage = () => {
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
      {/* Tiêu đề phản ánh đúng nội dung */}
      <Header title="Login" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 flex-grow">
        {/* Form đăng nhập */}
        <LoginForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
