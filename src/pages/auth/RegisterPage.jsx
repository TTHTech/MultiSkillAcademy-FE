import RegisterForm from "../../components/auth/RegisterForm";
import Header from "../../components/admin/common/Header";
import Footer from "../../components/student/common/Footer";
const BACKGROUND_IMAGE = "https://i2.wp.com/files.123freevectors.com/wp-content/original/129024-abstract-blue-and-white-radial-explosion-background-vector-art.jpg?w=420"; // Đường dẫn ảnh nền

const RegisterPage = () => {
  return (
    <div
      className="flex-1 overflow-auto relative z-10"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE})`, // Đặt ảnh nền
        backgroundSize: "cover", // Đảm bảo ảnh phủ toàn màn hình
        backgroundPosition: "center", // Căn giữa ảnh
        backgroundRepeat: "no-repeat", // Không lặp lại ảnh
        minHeight: "100vh", // Đảm bảo chiều cao tối thiểu toàn màn hình
      }}
    >
      {/* Tiêu đề phản ánh đúng nội dung */}
      <Header title="Register" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Form đăng ký */}
        <RegisterForm />
      </main>
       {/* Footer */}
       <Footer />
    </div>
  );
};

export default RegisterPage;
