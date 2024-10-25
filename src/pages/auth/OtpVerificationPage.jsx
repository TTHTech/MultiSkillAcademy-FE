
import OtpVerificationForm from "../../components/auth/OtpVerificationForm"; // Sửa lại đường dẫn cho đúng
// Đảm bảo đường dẫn chính xác

import Header from "../../components/admin/common/Header";


const LoginPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Tiêu đề phản ánh đúng nội dung */}
      <Header title="OTP Verification" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
       
        <OtpVerificationForm />
      </main>
    </div>
  );
};

export default LoginPage;
