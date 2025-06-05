import NavBar from "../../../components/student/common/NavBar";
import CertificatePage from "../../../components/student/certificate/CertificatePage";
import Footer from "../../../components/student/common/Footer";
import { ChevronRight } from "lucide-react";

const PageCertificate = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="shadow-md z-10">
        <NavBar />
      </header>

      <main className="flex-grow mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8 mt-8">
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8 mt-8">
            Danh sách chứng chỉ của bạn đã có
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <a
              href="/student/home"
              className="hover:text-blue-600 transition-colors duration-200 mt-[50px]"
            >
              Trang chủ
            </a>
            <ChevronRight className="w-4 h-4 mt-[50px]" />
            <span className="text-gray-700 font-medium mt-[50px]">
              Danh sách chứng chỉ
            </span>
          </div>
          <CertificatePage />
        </div>
      </main>
      <footer className="bg-white shadow-inner mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default PageCertificate;
