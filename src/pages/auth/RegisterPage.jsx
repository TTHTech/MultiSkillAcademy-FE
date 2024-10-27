import RegisterForm from "../../components/auth/RegisterForm";
import Header from "../../components/admin/common/Header";
const RegisterPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Tiêu đề phản ánh đúng nội dung */}
      <Header title="Register" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Form đăng nhập */}
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;
