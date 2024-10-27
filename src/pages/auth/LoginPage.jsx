import Header from "../../components/admin/common/Header";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Tiêu đề phản ánh đúng nội dung */}
      <Header title="Login" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Form đăng nhập */}
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
